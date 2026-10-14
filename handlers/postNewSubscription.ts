import { isPostSubscriptionValid } from "../validators/isPostSubscriptionValid.ts"
import { sendJson } from '../utilities/responses.ts'
import type { ServerResponse } from 'node:http'
import { pool } from '../utilities/database.ts'
import type { SubscriptionRow } from '../types.ts'

export async function postNewSubscription(data: unknown, res: ServerResponse) {

    const validatedPostReq = isPostSubscriptionValid(data)

    if (!validatedPostReq.valid) {
        return sendJson(res, 400, validatedPostReq.message)
    }


    //fields to updated
    const {
        name, 
        cost, 
        category, 
        billing_cycle, 
        next_billing_date,
        notes
    } = validatedPostReq.data

    const result = await pool.query<SubscriptionRow>(`
        INSERT INTO subscriptions (
            name, 
            cost, 
            category, 
            billing_cycle, 
            next_billing_date,
            notes
        ) VALUES (
         $1, $2, $3, $4, $5, $6
        )
         RETURNING *
        `, [name, cost, category, billing_cycle, next_billing_date?? null, notes?? null])


    return sendJson(res, 201, result.rows[0])
}