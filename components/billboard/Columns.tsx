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

export type BillboardColumn = {
    id: string;
    label: string;
    createdAt: string;
    category: string; 
    subtitle:string;
    cta: string

}

export const Columns: ColumnDef<BillboardColumn>[] = [
    {
        accessorKey: "label",
        header: "Label",
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        accessorKey: "cta",
        header: "CTA",
    },
    {
        accessorKey: "subtitle",
        header: "Subtitle",
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        id: 'actions',
        cell: ({row})=> <CellAction data={row.original} />
    }
    
] 

interface ICellAction {
    data: BillboardColumn


}

export const CellAction = ({data}: ICellAction)=>{
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const params = useParams();
    const onCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Billboard ID copied.");
    }

    const onDelete = async () => {
        try {
          setIsLoading(true);
          await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
          router.refresh();
          toast.success("billboard deleted!");
        } catch (error) {
          toast.error("You can't delete billboard with categories and products");
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
                <DropdownMenuItem onClick={()=>router.push(`/${params.storeId}/billboards/${data.id}`)} className="cursor-pointer">
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