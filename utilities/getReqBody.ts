import type { IncomingMessage } from 'node:http'

export async function getReqBody(req: IncomingMessage): Promise<object> {

    let body = ''

    for await (const chunk of req) {
        body += chunk.toString()
    }

    return JSON.parse(body)
}







