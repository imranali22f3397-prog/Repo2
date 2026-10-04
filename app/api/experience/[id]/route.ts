import {NextResponse} from 'next/server';
import {getExperience} from '@/lib/storage';
export const runtime='nodejs';
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){try{const {id}=await params;if(!/^[a-f0-9]{16}$/.test(id))return NextResponse.json({error:'Not found'},{status:404});const data=await getExperience(id);if(!data)return NextResponse.json({error:'Not found'},{status:404});return NextResponse.json(data)}catch{return NextResponse.json({error:'Not found'},{status:404})}}
