import {NextResponse} from 'next/server';
import {getExperience} from '@/lib/storage';
export const runtime='nodejs';
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){try{const {id}=await params;if(!/^[a-f0-9]{16}$/.test(id))return NextResponse.json({error:'Not found'},{status:404});const body=await req.json();const {password}=body;if(!password||typeof password!=='string')return NextResponse.json({error:'Password required'},{status:400});const data=await getExperience(id);if(!data)return NextResponse.json({error:'Not found'},{status:404});if(data.password!==password)return NextResponse.json({error:'Incorrect password'},{status:401});return NextResponse.json({valid:true})}catch{return NextResponse.json({error:'Not found'},{status:404})}}
