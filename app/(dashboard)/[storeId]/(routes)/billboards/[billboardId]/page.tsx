import BillboardForm from '@/components/BillboardForm';
import prismadb from '@/lib/prismadb'
import {} from '@prisma/client';
import React from 'react'

const BillboardPage = async ({params}: {params: {billboardId: string,storeId:string}}) => {
  
  const billboard =  await prismadb.billboard.findFirst({
    where: {
      id: params.billboardId
    }
  })
  const categories = await prismadb.category.findMany({
    where : {
      storeId: params.storeId
    }
  })
  return (
    <div className='flex-col'>
      <div className="space-y-4 flex-1 p-8">
        <BillboardForm categories={categories} initialData={billboard} />
      </div>
    </div>
  )
}

export default BillboardPage