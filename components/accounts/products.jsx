"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit, Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { useCurrency } from "@/providers/currency";
import { useToast } from "../ui/use-toast";
import { Link } from "../navigation";
import { useSession } from "next-auth/react";

export const ProductsTab = ({ shop, texts }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { currency, convertCurrency } = useCurrency();
  const { toast } = useToast();
  const [deletingProductId, setDeletingProductId] = useState(null);
  const { data: session } = useSession();

  async function deleteProduct(productId) {
    console.log("Delete button clicked for product ID:", productId);
    setDeletingProductId(productId);
    console.log("deletingProductId set to:", productId);

    // Simulate a delay to see the loading state
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      console.log("Sending delete request for product ID:", productId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/store/products/${productId}/delete/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Delete request successful");
        setProducts((prevProducts) => {
          console.log("Updating products state");
          return prevProducts.filter((product) => product.id !== productId);
        });
        toast({
          title: "Product deleted",
          description: "The product has been successfully removed.",
          status: "success",
        });
      } else {
        console.log("Delete request failed");
        toast({
          title: "Error",
          description: "Failed to delete the product. Please try again.",
          status: "error",
        });
      }
    } catch (error) {
      console.error("Error in delete request:", error);
      toast({
        title: "Network error",
        description: "Unable to connect to the server. Please try again.",
        status: "error",
      });
    } finally {
      console.log("Resetting deletingProductId to null");
      setDeletingProductId(null);
    }
  }

  useEffect(() => {
    if (shop?.products) {
      setProducts(shop.products);
    }
  }, [shop]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const pageCount = Math.ceil(products.length / itemsPerPage);

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <Card className="space-y-8 p-6 md:p-10">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <CardTitle className="text-2xl">
              {texts.dashboard.products.title}
            </CardTitle>
            <CardDescription>
              {texts.dashboard.products.description}
            </CardDescription>
          </div>
          <Link href={`/accounts/${shop?.id}/products/add`} passHref>
            <Button className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              {texts.dashboard.products.addProductButton}
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-full bg-secondary">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">
                  {texts.dashboard.products.tableHeaders.name}
                </TableHead>
                <TableHead className="text-center">
                  {texts.dashboard.products.tableHeaders.category}
                </TableHead>
                <TableHead className="text-center">
                  {texts.dashboard.products.tableHeaders.price}
                </TableHead>
                <TableHead className="text-center">
                  {texts.dashboard.products.tableHeaders.stock}
                </TableHead>
                <TableHead className="text-center">
                  {texts.dashboard.products.tableHeaders.actions}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody
              as={motion.tbody}
              variants={tableVariants}
              initial="hidden"
              animate="visible">
              <AnimatePresence>
                {currentItems.map((product) => (
                  <motion.tr
                    key={product.id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout>
                    <TableCell className="text-center font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {product.category}
                    </TableCell>
                    <TableCell className="text-center">
                      {currency}{" "}
                      {parseFloat(
                        convertCurrency(product.price, "XAF", currency)
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      {product.stock}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button size="sm" variant="outline" className="mr-2">
                        <Link
                          href={`/accounts/${shop.slug}/products/edit/${product.id}/`}>
                          <Edit className="w-4 h-4 mr-1" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`text-red-500 ${
                          deletingProductId === product.id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => deleteProduct(product.id)}
                        disabled={deletingProductId === product.id}>
                        {deletingProductId === product.id ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}>
                            <Loader2 className="w-4 h-4 mr-1" />
                          </motion.div>
                        ) : (
                          <Trash2 className="w-4 h-4 mr-1" />
                        )}
                        {texts.dashboard.products.actions.delete}
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          Showing {indexOfFirstItem + 1} to{" "}
          {Math.min(indexOfLastItem, products.length)} of {products.length}{" "}
          entries
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {[...Array(pageCount)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, pageCount))
                }
                disabled={currentPage === pageCount}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
};
