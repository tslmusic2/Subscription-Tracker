import type { SubscriptionRow, ValidationResult } from '../types.ts'
import { isValidISODate } from './isValidIsoDate.ts'




//!!!!!!!!!!!!I need to alter this for a patch or post request validation!!!!!!!!!!!!!!!!

export function isSubscriptionsValid(data: unknown): ValidationResult<SubscriptionRow> {

    if (
        data === null ||
        typeof data !== 'object' ||
        Array.isArray(data)
    ) {
        return {valid: false, message: 'Data is not a valid JSON object'}
    }


    const value = data as Record<string, unknown>
    const keys = Object.keys(value)
    const requiredValues = [
        'id',
        'name',
        'cost',
        'category',
        'billing_cycle',
        'active',
        'next_billing_date',
        'notes'
    ]

    //checks all required fields are present
    for (const field of requiredValues) {
        if (!keys.includes(field)) {
            return {valid: false, message: `${field} is a required field`}
        }
    }

    //'id'
    if (Number.isInteger(value.id)) {
        return {valid: false, message: 'id must be a valid integer '}
    }

    //cost   validate as string!!  may need to convert it to a number
    if (
        typeof value.cost !== 'number' ||
        !Number.isFinite(value.cost) || 
        value.cost < 0 || 
        value.cost > 99999999.99
    ) {
        return {valid: false, message: 'cost must be a valid number between 0 and 99999999.99 '}
    }

    //'name', 'category', 'billing_cycle'
    const stringFields = ['name', 'category', 'billing_cycle']
    for (const field of stringFields) {
        if (value.field === null || typeof value.field !== 'string' || value.field.trim().length=== 0) {
            return {valid: false, message: `${field} must be a non null, non empty string`}
        }
    }

    //'next_billing_date'   !!!Finish date validator utility if needed!!!
    if (!isValidISODate) {
        return {valid: false, message: 'next_billing_date must be a date in the format YYYY-DD-MM'}
    }

    //'active'
    if (value.active === null || typeof value.active !== 'boolean') {
        return {valid: false, message: 'active must be true or false'}
    }

    //'notes'
    if (value.notes !== null && (typeof value.notes !== 'string' || value.notes.trim().length=== 0)) {
            return {valid: false, message: 'Notes must be a non empty string' }
        }
    
    return {valid: true, data: value as SubscriptionRow}
}