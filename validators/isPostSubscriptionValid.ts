import type { PostSubscription, ValidationResult } from '../types.ts'
import { isValidISODate } from './isValidIsoDate.ts'



export function isPostSubscriptionValid(data: unknown): ValidationResult<PostSubscription> {

    if (
        data === null ||
        typeof data !== 'object' ||
        Array.isArray(data)
    ) {
        return {valid: false, message: 'Data is not a valid JSON object'}
    }


    const value = data as Record<string, unknown>
    const keys = Object.keys(value)

    const requiredValues = ['name', 'cost', 'category', 'billing_cycle']
    const allowedValues = [
        'name',
        'cost',
        'category',
        'billing_cycle',
        'next_billing_date',
        'notes'
    ]

    //checks all required fields are present
    for (const field of requiredValues) {
        if (!keys.includes(field)) {
            return {valid: false, message: `${field} is a required field`}
        }
    }

    //checks all fields are allowed fields
    for (const field of keys) {
        if (!allowedValues.includes(field)) {
            return {valid: false, message: `${field} is not a valid field`}
        }
    }



    //cost
    if (
        typeof value.cost !== 'number' ||
        !Number.isFinite(value.cost) || 
        value.cost < 0 || 
        value.cost > 99999999.99
    ) {
        return {valid: false, message: 'cost must be a valid number between 0 and 99999999.99 '}
    }

    //'name', 'category', 'billing_cycle'
    function isNonEmptyString(value: unknown): value is string {
        return (typeof value === 'string' && value.trim().length > 0)
    }

    //'name'
    if (!isNonEmptyString(value.name)) {
        return {valid: false, message: 'name must be a non null, non empty string'}
    }
    //'category'
    if (!isNonEmptyString(value.category)) {
        return {valid: false, message: 'category must be a non null, non empty string'}
    }
    //'billing_cycle'
    if (!isNonEmptyString(value.billing_cycle)) {
        return {valid: false, message: 'billing_cycle must be a non null, non empty string'}
    }

    const validatedData: PostSubscription = {
        name: value.name.trim(),
        cost: value.cost,
        category: value.category.trim(),
        billing_cycle: value.billing_cycle.trim(),
    }

    //'next_billing_date'
    if (Object.hasOwn(value, 'next_billing_date')) {
        const billDate = value.next_billing_date
        
        
        if (billDate === null) {
            validatedData.next_billing_date = null
        } else if (typeof billDate === 'string' && isValidISODate(billDate)) {
            validatedData.next_billing_date = billDate
        } else {
            return {valid: false, message: 'next_billing_date must be a date in the format YYYY-MM-DD or null'}
        }
    }

    //'notes'

    if (Object.hasOwn(value, 'notes')) {
        const notes = value.notes

        if (notes === null) {
            validatedData.notes = null
        } else if (isNonEmptyString(notes)) {
            validatedData.notes = notes.trim()
        } else {
            return {valid: false, message: 'Notes must be a non empty string' }
        }
        
    }


    return {valid: true, data: validatedData}
}