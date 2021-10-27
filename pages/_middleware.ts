import { NextRequest, NextResponse } from 'next/server';

function hex2bin(hex: string) {
    const buf = new Uint8Array(Math.ceil(hex.length / 2));
    for (let i = 0; i < buf.length; i++) {
        buf[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return buf;
}

const PUBLIC_KEY = crypto.subtle.importKey(
    'raw',
    hex2bin(process.env.CLIENT_PUBLIC_KEY),
    {
        name: 'NODE-ED25519',
        namedCurve: 'NODE-ED25519',
    },
    true,
    ['verify']
)


const encoder = new TextEncoder()

export default async function middleware(request: NextRequest) {
    console.log(request);
    const timestamp = request.headers.get('X-Signature-Timestamp') || '';
    const signature = hex2bin(request.headers.get('X-Signature-Ed25519'));
    const bodyText = await request.text()
    
    const validated = crypto.subtle.verify(
        'NODE-ED25519',
        await PUBLIC_KEY,
        signature,
        encoder.encode(timestamp + bodyText)
    )

    if (validated) {
        return NextResponse.next()
    } else {
        return new Response(
            'Invalid authorisation',
            {
                status: 403
            }
        )
    }
}