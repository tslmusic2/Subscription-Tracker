import http from 'node:http'
import { sendJson } from './utilities/responses.ts'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { pool } from './utilities/database.ts'
import { getSubscriptions } from './handlers/getSubscriptions.ts'
import { getSingleSubscription } from './handlers/getSingleSubscription.ts'
import { getReqBody } from './utilities/getReqBody.ts'
import { postNewSubscription } from './handlers/postNewSubscription.ts'
import { patchSubscription } from './handlers/patchSubscription.ts'

const PORT = 8008


const result = await pool.query(`
SELECT current_database() AS database_name;
`)

console.log('Connected to database:', result.rows[0].database_name)



const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {

    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')

    if (req.method === 'OPTIONS') {
    res.statusCode = 204
    return res.end()
    }
//-----------------------------------------------------------------------------------

    try {

        if (req.url === '/api/subscriptions' && req.method === 'GET') {

            return getSubscriptions(res)

        }


        if (req.url?.startsWith('/api/subscriptions/') && req.method === 'GET') {

            return getSingleSubscription(req, res)

        }



        if (req.url === '/api/subscriptions' && req.method === 'POST') {

            const parsedReqBody = await getReqBody(req)

            return await postNewSubscription(parsedReqBody, res)

        }


        if (req.url?.startsWith('/api/subscriptions/') && req.method === 'PATCH') {
            
            const parsedReqBody = await getReqBody(req)

            return await patchSubscription(parsedReqBody, res)

        }



        return sendJson(res, 404, {message: 'Route not found'})

    } catch(err) {
        console.log(err)
        return sendJson(res, 500, {message: 'Internal Server Error'})
    }

  

})

server.listen(PORT, () => console.log(`listening on port: ${PORT}`))







/*
GET
          Query Parameters
    /api/subscriptions?active=true
    /api/subscriptions?category=streaming

POST   /api/subscriptions

PATCH  /api/subscriptions/:id

DELETE /api/subscriptions/:id
*/