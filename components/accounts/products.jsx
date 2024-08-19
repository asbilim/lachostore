"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
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
import { Link } from "../navigation"; // Import Link component

export const ProductsTab = ({ shop, texts }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { currency, convertCurrency } = useCurrency();

  useEffect(() => {
    if (shop?.products) {
      setProducts(shop.products);
    }
  }, [shop]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const pageCount = Math.ceil(products.length / itemsPerPage);

  return (
    <Card className="space-y-8 p-6 md:p-10">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <CardTitle className="text-2xl ">
              {texts.dashboard.products.title}
            </CardTitle>
            <CardDescription className="">
              {texts.dashboard.products.description}
            </CardDescription>
          </div>
          {/* Link to Add Product Page */}
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
          <Table className="min-w-full bg-secondary ">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center ">
                  {texts.dashboard.products.tableHeaders.name}
                </TableHead>
                <TableHead className="text-center ">
                  {texts.dashboard.products.tableHeaders.category}
                </TableHead>
                <TableHead className="text-center ">
                  {texts.dashboard.products.tableHeaders.price}
                </TableHead>
                <TableHead className="text-center ">
                  {texts.dashboard.products.tableHeaders.stock}
                </TableHead>
                <TableHead className="text-center ">
                  {texts.dashboard.products.tableHeaders.actions}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {currentItems.map((product) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}>
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
                      <Button size="sm" variant="outline" className="mr-2 ">
                        {texts.dashboard.products.actions.edit}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500">
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
      <CardFooter className="flex flex-col md:flex-row justify-between items-center gap-4 ">
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
