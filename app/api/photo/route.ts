import {NextResponse} from 'next/server';
import {savePhoto} from '@/lib/storage';
export const runtime='nodejs';
const MAX=4*1024*1024;
export async function POST(req:Request){try{const type=req.headers.get('content-type')||'';if(!/^image\/(jpeg|png|webp|gif)$/.test(type))return NextResponse.json({error:'Invalid photo type.'},{status:400});const buf=await req.arrayBuffer();if(!buf.byteLength)return NextResponse.json({error:'Empty photo.'},{status:400});if(buf.byteLength>MAX)return NextResponse.json({error:'This photo is too large.'},{status:413});const id=crypto.randomUUID().replaceAll('-','').slice(0,16);const ext=type.split('/')[1]||'jpg';await savePhoto(`${id}.${ext}`,buf);return NextResponse.json({id,ext})}catch(e){console.error('Photo upload error:',e);return NextResponse.json({error:'Could not upload the photo. Please try again.'},{status:500})}}
