import { pool } from '../utilities/database.ts'
import { sendJson } from '../utilities/responses.ts'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { SubscriptionRow} from '../types.ts'


export async function getSingleSubscription(req: IncomingMessage, res: ServerResponse) {

    const id = Number(req.url?.split('/').pop())

    if (!Number.isInteger(id) || id < 1) {
        return sendJson(res, 400, {message: 'id must be a positive integer'})
    }

    const result = await pool.query<SubscriptionRow>(`
        SELECT * FROM subscriptions
        WHERE id = $1
        `, [id])

    if (result.rowCount === 0) {
        return sendJson(res, 404, {message: 'Subscription not found'})
    }
    return sendJson(res, 200, result.rows[0])
}