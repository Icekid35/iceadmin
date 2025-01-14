import prismadb from "@/lib/prismadb";
// import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // allow requests from any other domain
    "Access-Control-Allow-Methods": "GET,HEAD,PUT,OPTIONS,POST,DELETE",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

export async function POST(req: Request, {params}: { params: { storeId: string}}) {
    
    try {
        // const { userId} = auth();
        const body = await req.json();
        const {label, imageUrl,userId,subtitle,cta,categoryId} = body;

        if(!userId) return new NextResponse("Unauthenticated", {status: 401});
        if(!label) return new NextResponse("Label is required", {status: 400});
        if(!imageUrl) return new NextResponse("Image URL is required", {status: 400});
        if(!params.storeId) return new NextResponse("Store ID is required", {status: 400});

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })
        if(!storeByUserId) return new NextResponse("Unauthorized", {status: 403});
        
        const billboard = await prismadb.billboard.create
        ({
            data: {
                label,
                imageUrl,
                subtitle,
                cta,
                categoryId,
                storeId: params.storeId,
                
            },
            include:{
                category:true
            }
        })
        return NextResponse.json(billboard);
    } catch (error) {
        //console.log('BILLIBORDS_POST', error);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}




export async function GET(req: Request, {params}: { params: { storeId: string}}) {
    try {
       if(!params.storeId) return new NextResponse("Store ID is required", {status: 400});
        const billboards = await prismadb.billboard.findMany
        ({
            where: {
                storeId: params.storeId
            },
            include:{
                category:true
            }
        })
        return NextResponse.json(billboards, { headers: corsHeaders });
    } catch (error) {
        console.log('BILLIBORDS_POST', error);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}