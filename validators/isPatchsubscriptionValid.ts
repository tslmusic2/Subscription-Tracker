import type { PatchSubscription, ValidationResult } from "../types.ts"
import { isValidISODate } from "./isValidIsoDate.ts"

export function isPatchSubscriptionValid(data: unknown): ValidationResult<PatchSubscription>{
    
    if (
        data === null ||
        typeof data !== 'object' ||
        Array.isArray(data)
    ) {
        return {valid: false, message: 'Request must be a valid JSON object'}
    }


    const value = data as Record<string, unknown>
    const keys = Object.keys(data)
    if (keys.length === 0) {
        return {valid: false, message: 'At least one field is required'}
    }
    //'name', 'cost', 'category', 'billing_cycle', 'active', 'next_billing_date', 'notes'
    const allowedFields = ['name', 'cost', 'category', 'billing_cycle', 'active', 'next_billing_date', 'notes']


    //checks that all requested update fields are allowed and valid
    for (const field of keys) {
        if (!allowedFields.includes(field)) {
            return {valid: false, message: `${field} is not an allowed field`} 
        }
    }



    const validatedData: PatchSubscription = {}

    function isNonEmptyString(value:unknown): value is string {
        return (typeof value === 'string' && value.trim().length > 0) 
    }
    

    //'name'
    
    if(Object.hasOwn(value, 'name')) {
         if (!isNonEmptyString(value.name)) {
            return {valid: false, message: 'name must be a non null, non empty string'}
        }

            validatedData.name = value.name.trim()    
    }


    //'category'
    if(Object.hasOwn(value, 'category')) {
        if (!isNonEmptyString(value.category)) {
                return {valid: false, message: 'category must be a non null, non empty string'}
            }
        
                validatedData.category = value.category.trim()
    }


    //'billing_cycle'
    
    if(Object.hasOwn(value, 'billing_cycle')) {
        if (!isNonEmptyString(value.billing_cycle)) {
                return {valid: false, message: 'billing_cycle must be a non null, non empty string'}
            }

            validatedData.billing_cycle = value.billing_cycle.trim()  
    }


    //'notes'
    if (Object.hasOwn(value, 'notes')) {
        if (value.notes === null) {
            validatedData.notes = null
        } else if (isNonEmptyString(value.notes)) {
            validatedData.notes = value.notes.trim()
        } else {
            return {valid: false, message: 'notes must be a non empty string or null'}
        }
                 
    }
  
    //, 'cost', 
    if (Object.hasOwn(value, 'cost')) {
        if (
            typeof value.cost !== 'number' ||
            !Number.isFinite(value.cost) &&
            value.cost < 0 &&
            value.cost > 99999999.99
        ) {
            return {valid: false, message: 'cost must be a number between 0 and 99999999.99'}
        } 
            validatedData.cost = value.cost
    }
    
    //'active', 
    if (Object.hasOwn(value, 'active')) {
        if (typeof value.active === 'boolean') {
            validatedData.active = value.active
        } else {
            return {valid: false, message: 'active must be true or false'}
        }
    }
    
    
    //'next_billing_date',      type of this is currently Date but its actually a string
    if (Object.hasOwn(value, 'next_billing_date')) {
        if (value.next_billing_date === null) {
            validatedData.next_billing_date = null
        } else if (
            typeof validatedData.next_billing_date === 'string' &&
            isValidISODate(value.next_billing_date)
        ) {
            validatedData.next_billing_date = value.next_billing_date
           
        } else {
            return {valid: false, message: 'next_billing_date must be a date in the format YYYY-MM-DD or null'}
        }

            


    }

    return {valid: true, data: validatedData}
    
}