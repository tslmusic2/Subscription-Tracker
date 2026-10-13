

export type SubscriptionRow = {
    id: number
    name: string
    cost: string
    category: string
    billing_cycle: string
    active: boolean
    next_billing_date: Date | null
    notes: string | null
}

export type ValidationResult<T> = 
    {valid: true, data: T} |
    {valid: false, message: string}
