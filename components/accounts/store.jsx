"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DownloadCloud, AlertCircle, Package, Eye } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useCurrency } from "@/providers/currency";

export function OrdersTab({ texts, shop }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const { data: session } = useSession();

  const { currency, convertCurrency } = useCurrency();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/accounts/stores/${shop.id}/orders/`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [shop.id, session.accessToken]);

  const handleReturnOrder = (orderId) => {
    toast({
      title: "Return Initiated",
      description: `Return process started for order #${orderId}`,
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <Package className="mr-2 h-6 w-6 animate-spin" />
          <p>Loading orders...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{texts.dashboard.orders.title}</CardTitle>
        <CardDescription>{texts.dashboard.orders.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <Alert>
            <Package className="h-4 w-4" />
            <AlertTitle>No orders yet</AlertTitle>
            <AlertDescription>
              When you receive orders, they will appear here.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {texts.dashboard.orders.tableHeaders.orderNumber}
                  </TableHead>
                  <TableHead>
                    {texts.dashboard.orders.tableHeaders.status}
                  </TableHead>
                  <TableHead className="text-right">
                    {texts.dashboard.orders.tableHeaders.total}
                  </TableHead>
                  <TableHead className="text-right">
                    {texts.dashboard.orders.tableHeaders.actions}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      #{order.reference_number}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "PENDING" ? "outline" : "secondary"
                        }>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {currency + " "}
                      {parseFloat(
                        convertCurrency(order.total_amount, "XAF", currency)
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="mr-2">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Order Details: #{order.reference_number}
                            </DialogTitle>
                            <DialogDescription>
                              Status: {order.status} | Total: {currency + " "}
                              {parseFloat(
                                convertCurrency(
                                  order.total_amount,
                                  "XAF",
                                  currency
                                )
                              ).toFixed(2)}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4">
                            <h4 className="font-semibold mb-2">Items:</h4>
                            <ul>
                              {order.items.map((item, index) => (
                                <li key={index} className="mb-4">
                                  <div className="flex items-center">
                                    {item.product.image && (
                                      <Image
                                        src={item.product.image}
                                        alt={item.product.name}
                                        className="w-16 h-16 mr-4 object-cover"
                                        width={100}
                                        height={100}
                                        unoptimized
                                      />
                                    )}
                                    <div>
                                      <p className="font-medium">
                                        {item.product.name}
                                      </p>
                                      <p>
                                        Quantity: {item.quantity}, Price:
                                        {currency + " "}
                                        {parseFloat(
                                          convertCurrency(
                                            item.price,
                                            "XAF",
                                            currency
                                          )
                                        ).toFixed(2)}
                                      </p>
                                      {item.color && <p>Color: {item.color}</p>}
                                      {item.size && <p>Size: {item.size}</p>}
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
