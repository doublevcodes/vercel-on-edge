import { VercelRequest, VercelResponse } from '@vercel/node';


function jsonResponse(obj: any) {
    return new Response(
        obj,
        { headers: {'Content-Type': 'application/json'} }
    )
}

async function handleInteraction({ request }) {
    const body = JSON.parse(await request.text())

    switch (body.type) {
        case 1:
            return jsonResponse({
                type: 1
            })
    }
}

export default async function handleRequest(request: VercelRequest, response: VercelResponse) {
    
    if (request.method === "POST") {
        return await handleInteraction({ request })
    }

}