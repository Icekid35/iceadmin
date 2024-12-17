import prismadb from "@/lib/prismadb";
// import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, {params}: { params: { storeId: string}}) {
    
    try {
        // const { userId} = auth();
        const body = await req.json();
        console.log(body)
        const {name,userId, price, images,description, isFeatured, isArchived, categoryId, sizes,colors,discount} = body;

        if(!userId) return new NextResponse("Unauthenticated", {status: 401});
        if(!name) return new NextResponse("name is required", {status: 400});
        if(!price) return new NextResponse("price is required", {status: 400});
        if(!categoryId) return new NextResponse("category is required", {status: 400});
        if(!params.storeId) return new NextResponse("Store ID is required", {status: 400});
        if(!images || !images.length) {
            return new NextResponse("At least one image is required", {status: 400});
        }
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })
        if(!storeByUserId) return new NextResponse("Unauthorized", {status: 403});
        
        const product = await prismadb.product.create
        ({
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                sizes,
                colors,
                discount,
                description,
                ratings:[],
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image)
                        ]
                    }
                }
            }
        })
        return NextResponse.json(product);
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Server Error", {status: 500})
    }
}
const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // allow requests from any other domain
    "Access-Control-Allow-Methods": "GET,HEAD,PUT,OPTIONS,POST,DELETE",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

// GET -> {origin}/{storeId}/products
export async function GET(req: Request, {params}: { params: { storeId: string}}) {
    try {
        console.log("active...")
        const {searchParams} = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        // const sizeId = searchParams.get("sizeId") || undefined;
        const isFeatured = searchParams.get("isFeatured");

       if(!params.storeId) return new NextResponse("Store ID is required", {status: 400});
        const products = await prismadb.product.findMany
        ({
            where: {
                storeId: params.storeId,
                categoryId,
                // sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false,
            },
            include : {
                images: true,
                category: true,
                // size: true,
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        return NextResponse.json(products, { headers: corsHeaders });
    } catch (error) {
        return new NextResponse("Internal Server Error", {status: 500})
    }
}