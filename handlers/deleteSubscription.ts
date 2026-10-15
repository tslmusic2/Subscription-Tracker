import type { IncomingMessage, ServerResponse } from 'node:http'
import { sendJson } from '../utilities/responses.ts'
import { pool } from '../utilities/database.ts'
import type { SubscriptionRow } from '../types.ts'

export async function deleteSubscription(req: IncomingMessage, res: ServerResponse) {

    const id = Number(req.url?.split('/').pop())
    if (
        !Number.isInteger(id) ||
        id < 1 ||
        id > 2147483647
    ) {
        return sendJson(res, 400, {message: 'id must be a valid integer between 1 and 2147483647'})
    }


    const result = await pool.query<SubscriptionRow>(`
        DELETE FROM subscriptions
        WHERE id = $1
        RETURNING *;
        `, [id])

    if (result.rowCount === 0) {
        return sendJson(res, 404, {message: 'Subscription not found'})
    }

    return sendJson(res, 200, {message: 'subscription deleted successfully', data: result.rows[0]})

}