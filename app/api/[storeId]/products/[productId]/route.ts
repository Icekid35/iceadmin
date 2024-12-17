import prismadb from "@/lib/prismadb";
// import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // allow requests from any other domain
    "Access-Control-Allow-Methods": "GET,HEAD,PUT,OPTIONS,POST,DELETE",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

export async function POST(req: Request, { params }: { params: { productId: string } }) {
    try {
        const body = await req.json();
        const { rating } = body;
         console.log(rating)
        // Validate the input rating
        if (rating === undefined || typeof rating !== "number" || rating < 0 || rating > 5) {
            return new NextResponse("Rating must be a number between 0 and 5", { status: 400 });
        }

        if (!params.productId) {
            return new NextResponse("Product ID is required", { status: 400 });
        }

        // Fetch the existing product to get current ratings
        const existingProduct = await prismadb.product.findUnique({
            where: { id: params.productId },
            select: { ratings: true },
        });

        if (!existingProduct) {
            return new NextResponse("Product not found", { status: 404 });
        }

        // Append the new rating to the existing ratings array
        const updatedRatings = [...(existingProduct.ratings || []), rating];

        // Update the product with the new ratings array
        const updatedProduct = await prismadb.product.update({
            where: { id: params.productId },
            data: { ratings: updatedRatings },
        });

        return NextResponse.json(updatedProduct, { headers: corsHeaders });
    } catch (error) {
        console.error("Error adding rating:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(req: Request, {params}: {params: {storeId: string, productId: string}}){
    try {
        // const { userId} = auth();
        const body = await req.json();
        const {name,userId, price,description, images, isFeatured, isArchived, categoryId,  sizes,colors,discount} = body;
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
        

         await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data : {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                sizes,
                colors,
                description,
                discount,
                images: {
                    deleteMany: {},
                }
            }
        });

        const product = await prismadb.product.update({
            where:{
            id: params.productId,
            },
            data: {
                images: {
                    createMany:{
                        data: [
                            ...images.map((image: {url: string}) => image)
                        ]
                    }
                }
            }
        })
        return NextResponse.json(product);
    } catch (error) {
        return new NextResponse("Internal Server Error", {status: 500});
    }

}
export async function DELETE(_req: Request, {params}: {params: {storeId: string, productId: string}}){
    try {
        // const { userId} = auth();
        
        // if(!userId){
        //     return new NextResponse("Unauthorized", {status: 401});
        // }
        
        if(!params.storeId){
            return new NextResponse("Store ID is required", {status: 400});
        }
        if(!params.productId){
            return new NextResponse("Billboard ID is required", {status: 400});
        }
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                // userId
            }
        })
        if(!storeByUserId) return new NextResponse("Unauthorized", {status: 403});
        
        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,
            }
            
        });
        return NextResponse.json(product);
    } catch (error) {
        return new NextResponse("Internal Server Error", {status: 500});
    }


}
export async function GET(_req: Request, {params}: {params: { productId: string}}){
    try {
       
        if(!params.productId){
            return new NextResponse("Product ID is required", {status: 400});
        }
       
        const product = await prismadb.product.findFirst({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
                // size: true,
            }
        });
        return NextResponse.json(product);
    } catch (error) {
        return new NextResponse("Internal Server Error", {status: 500});
    }

}


export async function OPTIONS() {
    // Handle preflight request
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PATCH, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      status: 204, // No Content
    });
  }