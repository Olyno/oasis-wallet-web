/* tslint:disable */
/* eslint-disable */
/**
 * OasisExplorer API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface OperationsRow
 */
export interface OperationsRow {
    /**
     * 
     * @type {number}
     * @memberof OperationsRow
     */
    level?: number;
    /**
     * 
     * @type {string}
     * @memberof OperationsRow
     */
    hash?: string;
    /**
     * 
     * @type {number}
     * @memberof OperationsRow
     */
    nonce?: number;
    /**
     * 
     * @type {number}
     * @memberof OperationsRow
     */
    timestamp?: number;
    /**
     * 
     * @type {string}
     * @memberof OperationsRow
     */
    type?: OperationsRowTypeEnum;
    /**
     * 
     * @type {string}
     * @memberof OperationsRow
     */
    from?: string;
    /**
     * 
     * @type {string}
     * @memberof OperationsRow
     */
    to?: string;
    /**
     * 
     * @type {number}
     * @memberof OperationsRow
     */
    amount?: number;
    /**
     * 
     * @type {number}
     * @memberof OperationsRow
     */
    escrow_amount?: number;
    /**
     * 
     * @type {number}
     * @memberof OperationsRow
     */
    reclaim_escrow_amount?: number;
    /**
     * 
     * @type {number}
     * @memberof OperationsRow
     */
    fee?: number;
    /**
     * 
     * @type {number}
     * @memberof OperationsRow
     */
    gas_used?: number;
    /**
     * 
     * @type {number}
     * @memberof OperationsRow
     */
    gas_price?: number;
    /**
     * 
     * @type {boolean}
     * @memberof OperationsRow
     */
    status?: boolean;
    /**
     * 
     * @type {string}
     * @memberof OperationsRow
     */
    error?: string;
}

/**
* @export
* @enum {string}
*/
export enum OperationsRowTypeEnum {
    Transfer = 'transfer',
    Addescrow = 'addescrow',
    Reclaimescrow = 'reclaimescrow',
    Allow = 'allow',
    Amendcommissionschedule = 'amendcommissionschedule',
    Executorcommit = 'executorcommit',
    Executorproposertimeout = 'executorproposertimeout',
    Registerentity = 'registerentity',
    Registernode = 'registernode',
    Registerruntime = 'registerruntime',
    Castvote = 'castvote',
    Submitproposal = 'submitproposal',
    Pvsscommit = 'pvsscommit',
    Pvssreveal = 'pvssreveal'
}

export function OperationsRowFromJSON(json: any): OperationsRow {
    return OperationsRowFromJSONTyped(json, false);
}

export function OperationsRowFromJSONTyped(json: any, ignoreDiscriminator: boolean): OperationsRow {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'level': !exists(json, 'level') ? undefined : json['level'],
        'hash': !exists(json, 'hash') ? undefined : json['hash'],
        'nonce': !exists(json, 'nonce') ? undefined : json['nonce'],
        'timestamp': !exists(json, 'timestamp') ? undefined : json['timestamp'],
        'type': !exists(json, 'type') ? undefined : json['type'],
        'from': !exists(json, 'from') ? undefined : json['from'],
        'to': !exists(json, 'to') ? undefined : json['to'],
        'amount': !exists(json, 'amount') ? undefined : json['amount'],
        'escrow_amount': !exists(json, 'escrow_amount') ? undefined : json['escrow_amount'],
        'reclaim_escrow_amount': !exists(json, 'reclaim_escrow_amount') ? undefined : json['reclaim_escrow_amount'],
        'fee': !exists(json, 'fee') ? undefined : json['fee'],
        'gas_used': !exists(json, 'gas_used') ? undefined : json['gas_used'],
        'gas_price': !exists(json, 'gas_price') ? undefined : json['gas_price'],
        'status': !exists(json, 'status') ? undefined : json['status'],
        'error': !exists(json, 'error') ? undefined : json['error'],
    };
}

export function OperationsRowToJSON(value?: OperationsRow | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'level': value.level,
        'hash': value.hash,
        'nonce': value.nonce,
        'timestamp': value.timestamp,
        'type': value.type,
        'from': value.from,
        'to': value.to,
        'amount': value.amount,
        'escrow_amount': value.escrow_amount,
        'reclaim_escrow_amount': value.reclaim_escrow_amount,
        'fee': value.fee,
        'gas_used': value.gas_used,
        'gas_price': value.gas_price,
        'status': value.status,
        'error': value.error,
    };
}


