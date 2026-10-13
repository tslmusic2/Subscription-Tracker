import { pool } from '../utilities/database.ts'
import { sendJson } from '../utilities/responses.ts'
import type { ServerResponse } from 'node:http'
import type { SubscriptionRow} from '../types.ts'




export async function getSubscriptions(res: ServerResponse) {

    const result = await pool.query<SubscriptionRow>(`
        SELECT * FROM subscriptions
        ORDER BY id;
        `)

    return sendJson(res, 200, result.rows)
}


