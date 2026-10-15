import { pool } from '../utilities/database.ts'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { isPatchSubscriptionValid } from '../validators/isPatchSubscriptionValid.ts'
import { sendJson } from '../utilities/responses.ts'
import type { SubscriptionRow } from '../types.ts'


export async function patchSubscription(data: unknown,req: IncomingMessage, res: ServerResponse) {
    
    const id = Number(req.url?.split('/').pop())
    if (
        !Number.isInteger(id) ||
        id < 1 ||
        id > 2147483647
    ) {
        return sendJson(res, 400, {message: 'Request id must be a valid number between 1 and 2147483647'})
    }
    
    const validatedPatchReq = isPatchSubscriptionValid(data)
    if (!validatedPatchReq.valid) {
        return sendJson(res, 400, {message: validatedPatchReq.message})
    }


//==================== SQL Section ================================//
    const patchKeys = Object.keys(validatedPatchReq.data)
    
    //I need updateFields  to look like this  ['field' = $1, 'field2' = $2,]
    const updateFields = patchKeys.map((key, index) => `${key} = $${index + 1}`)

    const values = Object.values(validatedPatchReq.data)
    const idPlaceholder = `$${updateFields.length + 1}` 
    
    const result = await pool.query<SubscriptionRow>(`
        UPDATE subscriptions
        SET ${updateFields.join(', ')}
        WHERE id = ${idPlaceholder}
        RETURNING *;
        `, [...values, id])


    if (result.rowCount === 0) {
        return sendJson(res, 404, {message: 'Subscription not found'})
    }

    return sendJson( res, 200, result.rows[0])
}