// import { take, call, put, select, takeLatest } from 'redux-saga/effects';
// import { stakingActions as actions } from '.';
import { address as oasisAddress, quantity } from '@oasisprotocol/client'
import {
  StakingDebondingDelegationInfo,
  StakingDelegationInfo,
  StakingSharePool,
} from '@oasisprotocol/client/dist/types'
import { PayloadAction } from '@reduxjs/toolkit'
import { addressToPublicKey } from 'app/lib/helpers'
import { all, call, put, select, takeEvery } from 'typed-redux-saga'

import { stakingActions } from '.'
import { getExplorerAPIs, getOasisNic } from '../network/saga'
import { selectEpoch, selectSelectedNetwork } from '../network/selectors'
import { selectValidators } from './selectors'
import { CommissionBound, DebondingDelegation, Delegation } from './types'
import * as dump_validators from 'vendors/oasisscan/dump_validators.json'

function getSharePrice(pool: StakingSharePool) {
  const balance = Number(quantity.toBigInt(pool.balance!)) / 10 ** 9
  const share = Number(quantity.toBigInt(pool.total_shares!)) / 10 ** 9
  return balance / share
}

function* getValidatorByAddress(address: string) {
  const validators = yield* select(selectValidators)
  return validators.find(v => v.address === address)
}

function* makeDelegation(
  bytesAddress: Uint8Array,
  delegation: StakingDelegationInfo | StakingDebondingDelegationInfo,
) {
  const address = oasisAddress.toBech32('oasis', bytesAddress)
  const sharePrice = getSharePrice(delegation.pool)
  const shares = quantity.toBigInt(delegation.shares)

  const amount = BigInt(Math.round(Number(shares) * sharePrice))

  return {
    validator: yield* getValidatorByAddress(address),
    validatorAddress: address,
    amount: amount.toString(),
    shares: quantity.toBigInt(delegation.shares).toString(),
  } as Delegation
}

function* loadDelegations(publicKey: Uint8Array) {
  const nic = yield* call(getOasisNic)
  const response = yield* call([nic, nic.stakingDelegationInfosFor], { owner: publicKey, height: 0 })
  const delegations: Delegation[] = []

  for (let [validatorPublicKey, rawDelegation] of response) {
    const delegation = yield* call(makeDelegation, validatorPublicKey, rawDelegation)
    delegations.push(delegation)
  }

  return delegations
}

function* loadDebondingDelegations(publicKey: Uint8Array) {
  const nic = yield* call(getOasisNic)
  const response = yield* call([nic, nic.stakingDebondingDelegationInfosFor], {
    owner: publicKey,
    height: 0,
  })

  const debondingDelegations: DebondingDelegation[] = []

  // For each escrow account...
  for (let [publicKey, rawDebondingDelegations] of response) {
    // And then for each debonding delegation for this account
    for (let rawDebondingDelegation of rawDebondingDelegations) {
      const delegation = yield* call(makeDelegation, publicKey, rawDebondingDelegation)
      debondingDelegations.push({
        ...delegation,
        epoch: Number(rawDebondingDelegation.debond_end),
      })
    }
  }

  return debondingDelegations
}

function* refreshValidators() {
  const network = yield* select(selectSelectedNetwork)
  const { getAllValidators } = yield* call(getExplorerAPIs)
  try {
    const validators = yield* call(getAllValidators)
    yield* put(
      stakingActions.updateValidators({
        timestamp: Date.now(),
        network: network,
        list: validators,
      }),
    )
  } catch (e) {
    console.error('get validators list failed, continuing without updated list.', e)
    yield* put(
      stakingActions.updateValidatorsError({
        error: '' + e,
        validators: {
          timestamp: dump_validators.dump_timestamp,
          network: network,
          list: dump_validators.list.map(v => {
            return {
              ...v,
              status: 'unknown',
            }
          }),
        },
      }),
    )
    return
  }
}

function* getValidatorDetails({ payload: address }: PayloadAction<string>) {
  const nic = yield* call(getOasisNic)
  const publicKey = yield* call(addressToPublicKey, address)
  const account = yield* call([nic, nic.stakingAccount], { owner: publicKey, height: 0 })
  const currentEpoch = yield* select(selectEpoch)

  let rawBounds = account.escrow?.commission_schedule?.bounds
  if (!rawBounds) {
    rawBounds = []
  }

  const bounds: CommissionBound[] = rawBounds
    .map(b => ({
      epochStart: b.start ? Number(b.start) : 0,
      lower: b.rate_min ? Number(quantity.toBigInt(b.rate_min)) / 100_000 : 0,
      upper: b.rate_max ? Number(quantity.toBigInt(b.rate_max)) / 100_000 : 0,
    }))
    // Always clone before sort so it doesn't mutate source
    .slice()
    .sort((a, b) => a.epochStart - b.epochStart)
    // If we have another bound after this one, attach the epochEnd to this one
    .map((b, i, array) => ({
      ...b,
      epochEnd: array[i + 1] ? array[i + 1].epochStart - 1 : undefined,
    }))
    // Filter out bounds that ended in the past
    .filter(b => !b.epochEnd || b.epochEnd > currentEpoch)

  yield* put(
    stakingActions.updateValidatorDetails({
      scheduledCommissionBounds: bounds,
    }),
  )
}

export function* fetchAccount({ payload: address }: PayloadAction<string>) {
  yield* put(stakingActions.setLoading(true))
  const publicKey = yield* call(addressToPublicKey, address)
  yield* call(refreshValidators)

  const { delegations, debondingDelegations } = yield* all({
    delegations: call(loadDelegations, publicKey),
    debondingDelegations: call(loadDebondingDelegations, publicKey),
  })

  yield* put(stakingActions.updateDelegations(delegations))
  yield* put(stakingActions.updateDebondingDelegations(debondingDelegations))

  yield* put(stakingActions.setLoading(false))
}

export function* stakingSaga() {
  yield* takeEvery(stakingActions.fetchAccount, fetchAccount)
  yield* takeEvery(stakingActions.validatorSelected, getValidatorDetails)
}
