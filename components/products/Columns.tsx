"use client"

import {ColumnDef} from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Copy, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import AlertModal from "../modals/alertModal";

export type ProductColumn = {
    id: string;
    name: string;
    price: number;
    discount: number | undefined;
    isFeatured: boolean;
    isArchived: boolean;
    createdAt: string;
    sizes: string[];
    colors: string[];
    category: string; 
}

export const Columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "price",
        header: "Price",
    },
    {
        accessorKey: "discount",
        header: "Discount(%)",
    },
    {
        accessorKey: "isArchived",
        header: "Archive",
    },
    {
        accessorKey: "isFeatured",
        header: "Featured",
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "sizes",
        header: "Size(s)",
    },
    {
        accessorKey: "colors",
        header: "Color(s)",
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: 'actions',
        cell: ({row})=> <CellAction data={row.original} />
    }
    
] 

interface ICellAction {
    data: ProductColumn


}

export const CellAction = ({data}: ICellAction)=>{
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const params = useParams();
    const onCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Product ID copied.");
    }

    const onDelete = async () => {
        try {
          setIsLoading(true);
          await axios.delete(`/api/${params.storeId}/products/${data.id}`);
          router.refresh();
          toast.success("product deleted!");
        } catch (error) {
          toast.error("Failed to delete product");
        } finally {
          setIsLoading(false);
          setIsOpen(false);
        }
      };
    return (
        <>
        <AlertModal isLoading={isLoading} isOpen={isOpen} onClose={()=>setIsOpen(false)} onConfirm={onDelete}/>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost"  className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-5 w-5 "/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    actions
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={()=>router.push(`/${params.storeId}/products/${data.id}`)} className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" />
                    Update
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={()=>onCopy(data.id)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy ID
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=>setIsOpen(true)} className="cursor-pointer">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    )
}