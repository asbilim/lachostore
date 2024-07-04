"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCart } from "@/providers/cart";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Loader2, AlertCircle } from "lucide-react";

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  postalCode: z
    .string()
    .min(3, { message: "Postal code must be at least 3 characters." }),
  paymentMethod: z.enum(["card", "orange", "mtn"]),
  phoneNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{9,}$/.test(val), {
      message: "Phone number must be at least 9 digits.",
    }),
  cardNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{16}$/.test(val), {
      message: "Card number must be 16 digits.",
    }),
  cardExpiry: z
    .string()
    .optional()
    .refine((val) => !val || /^(0[1-9]|1[0-2])\/\d{2}$/.test(val), {
      message: "Expiry date must be in MM/YY format.",
    }),
  cardCVC: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{3,4}$/.test(val), {
      message: "CVC must be 3 or 4 digits.",
    }),
});

export default function CheckoutPage() {
  const { cart, loading, removeFromCart, updateQuantity } = useCart();
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      defaultValues: {
        fullName: "",
        email: "",
        address: "",
        city: "",
        postalCode: "",
        paymentMethod: "card",
        phoneNumber: "",
        cardNumber: "",
        cardExpiry: "",
        cardCVC: "",
      },
    },
  });

  const watchPaymentMethod = form.watch("paymentMethod");

  const onSubmit = (data) => {
    console.log(data);
    // Simulate order placement
    setIsOrderPlaced(true);
  };

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = 5.99;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading your cart...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto overflow-x-hidden flex items-center w-full justify-center flex-col py-8 px-4 md:px-0">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <AnimatePresence>
        {isOrderPlaced ? (
          <OrderConfirmation total={total} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-2 gap-8 w-full max-w-7xl">
            <CartSummary
              cart={cart}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              onSubmit={form.handleSubmit(onSubmit)}
            />
            <ShippingAndPaymentForm
              form={form}
              watchPaymentMethod={watchPaymentMethod}
              onSubmit={onSubmit}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CartSummary({
  cart,
  removeFromCart,
  updateQuantity,
  subtotal,
  shipping,
  total,
  onSubmit,
}) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Your Cart</CardTitle>
        <CardDescription>Review and modify your items</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ScrollArea className="h-[400px] rounded-md border p-4">
          {cart.length === 0 ? (
            <EmptyCart />
          ) : (
            cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
              />
            ))
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between">
        <OrderSummary subtotal={subtotal} shipping={shipping} total={total} />
        <Button onClick={onSubmit} disabled={cart.length === 0}>
          Place Order
        </Button>
      </CardFooter>
    </Card>
  );
}

function CartItem({ item, removeFromCart, updateQuantity }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center justify-between py-4 border-b last:border-b-0">
      <div className="flex items-center space-x-4">
        <Image
          src={"https://placehold.co/400x600.png"}
          alt={item.name}
          className="w-16 h-16 rounded-md object-cover"
          width={64}
          height={64}
        />
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Select
          value={item.quantity.toString()}
          onValueChange={(value) =>
            updateQuantity(item.id, parseInt(value, 10))
          }>
          <SelectTrigger className="w-16">
            <SelectValue>{item.quantity}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={() => removeFromCart(item.id)}>
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
      <p className="text-lg font-semibold text-gray-600">Your cart is empty</p>
      <p className="text-sm text-gray-500 mt-2">
        Add some items to your cart to proceed with checkout.
      </p>
    </div>
  );
}

function OrderSummary({ subtotal, shipping, total }) {
  return (
    <div>
      <p className="text-sm text-gray-500">Subtotal: ${subtotal.toFixed(2)}</p>
      <p className="text-sm text-gray-500">Shipping: ${shipping.toFixed(2)}</p>
      <p className="font-semibold">Total: ${total.toFixed(2)}</p>
    </div>
  );
}

// ... (The rest of the components will be in the next part)

function TrashIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
function ShippingAndPaymentForm({ form, watchPaymentMethod, onSubmit }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping & Payment</CardTitle>
        <CardDescription>
          Enter your details to complete the order
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}>
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <PaymentMethodSelector
                form={form}
                watchPaymentMethod={watchPaymentMethod}
              />
            </motion.div>
            <Button type="submit" className="w-full">
              Complete Order
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function PaymentMethodSelector({ form, watchPaymentMethod }) {
  return (
    <>
      <FormField
        control={form.control}
        name="paymentMethod"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Payment Method</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="card" />
                  </FormControl>
                  <FormLabel className="font-normal">Credit Card</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="orange" />
                  </FormControl>
                  <FormLabel className="font-normal">Orange Money</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="mtn" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    MTN Mobile Money
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <AnimatePresence>
        {watchPaymentMethod === "card" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}>
            <CreditCardFields form={form} />
          </motion.div>
        )}
        {(watchPaymentMethod === "orange" || watchPaymentMethod === "mtn") && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}>
            <MobileMoneyFields form={form} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function CreditCardFields({ form }) {
  return (
    <>
      <FormField
        control={form.control}
        name="cardNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Card Number</FormLabel>
            <FormControl>
              <Input {...field} placeholder="1234 5678 9012 3456" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="cardExpiry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Date</FormLabel>
              <FormControl>
                <Input {...field} placeholder="MM/YY" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cardCVC"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CVC</FormLabel>
              <FormControl>
                <Input {...field} placeholder="123" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}

function MobileMoneyFields({ form }) {
  return (
    <FormField
      control={form.control}
      name="phoneNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Phone Number</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Enter your phone number" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function OrderConfirmation({ total }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}>
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      </motion.div>
      <h2 className="text-2xl font-bold mb-4">Order Confirmed!</h2>
      <p className="text-gray-600 mb-6">
        Thank you for your purchase. Your order has been successfully placed.
      </p>
      <p className="text-xl font-semibold mb-8">Total: ${total.toFixed(2)}</p>
      <Button className="w-full">View Order Details</Button>
    </motion.div>
  );
}

function CheckCircle(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
