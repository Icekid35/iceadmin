import prismadb from "@/lib/prismadb";
// import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

export default async function SetupLayout({children}:{children: React.ReactNode}){
    const userId = "user_2qD6Z3k9fUqNxTznfcJFj0TTK7a";
    // const {userId} = auth();
    if (!userId) redirect('/sign-in');
    console.log(userId)
    const store = await prismadb.store.findFirst({
        where: {
            userId,
        }
    });
    if(store){
        redirect(`/${store?.id}`)
    }
    return(
        <>
        {children}
        </>
    )
}