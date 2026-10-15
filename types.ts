

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

export type PatchSubscription = Partial<PostSubscription & {active: boolean}>


export type PostSubscription = {
    name: string
    cost: number
    category: string
    billing_cycle: string
    next_billing_date?: string | null
    notes?: string | null
}



export type ValidationResult<T> = 
    {valid: true, data: T} |
    {valid: false, message: string}

