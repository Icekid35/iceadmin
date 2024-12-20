import { OrderColumn } from "@/components/orders/Columns";
import OrderClient from "@/components/orders/client";
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems:true
    },
    take: 20,
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    phone: order.phone,
    name: order.name,
    email: order.email,
    address: order.address,
    isPaid: order.isPaid,
    products: order.orderItems
      .map((orderItem) => `${orderItem.quantity} ${orderItem.title}\n${orderItem.colors.join(",")}\n${orderItem.sizes.join(",")}`)
      .join(", "),
    totalPrice: order.orderItems.reduce(
      (acc, orderItem) => acc + orderItem.total,
      0
    ),
    createdAt: format(order.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
