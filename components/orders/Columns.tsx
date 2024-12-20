import {ColumnDef} from "@tanstack/react-table";


export type OrderColumn = {
    id: string;
    phone: string;
    email: string;
    name: string;
    isPaid: boolean;
    address: string;
    totalPrice: string | number;
    products: string;
    createdAt: string;
}

export const Columns: ColumnDef<OrderColumn>[] = [
    {
        accessorKey: "products",
        header: "Products",
    },
    {
        accessorKey: "name",
        header: "Customer Name",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "email",
        header: "Email",
    },

    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "totalPrice",
        header: "Total Price",
    },
    {
        accessorKey: "isPaid",
        header: "Paid",
    }
    
] 
