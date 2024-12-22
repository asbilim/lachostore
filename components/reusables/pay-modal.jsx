"use client";

import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/providers/cart";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreditCard, DollarSign, Mountain, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useCurrency } from "@/providers/currency";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const paymentSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email("Invalid email address"),
  shipping_address: z
    .string()
    .min(10, "Please provide a detailed shipping address"),
  cardNumber: z.string().optional(),
  expiry: z.string().optional(),
  cvc: z.string().optional(),
  name: z.string().optional(),
});

const PaymentForm = ({ control, errors, paymentMethod }) => (
  <div className="space-y-4">
    {(paymentMethod === "orange-money" || paymentMethod === "mtn-money") && (
      <>
        <Label htmlFor="phone" className="text-lg font-medium">
          {paymentMethod === "orange-money"
            ? "Orange Money Number"
            : "MTN Money Number"}
        </Label>
        <Controller
          name="phone"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              id="phone"
              type="tel"
              placeholder={
                paymentMethod === "orange-money" ? "69XXXXXXX" : "67XXXXXXX"
              }
              className="input-masked"
            />
          )}
        />
        {errors.phone && (
          <p className="text-destructive text-sm">{errors.phone.message}</p>
        )}
      </>
    )}

    {paymentMethod === "credit-card" && (
      <>
        <Label htmlFor="card-number" className="text-lg font-medium">
          Card Number
        </Label>
        <Controller
          name="cardNumber"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              id="card-number"
              type="text"
              placeholder="4111 1111 1111 1111"
              className="input-masked"
            />
          )}
        />
        {errors.cardNumber && (
          <p className="text-destructive text-sm">
            {errors.cardNumber.message}
          </p>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="card-expiry" className="text-lg font-medium">
              Expiry
            </Label>
            <Controller
              name="expiry"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  {...field}
                  id="card-expiry"
                  type="text"
                  placeholder="MM/YY"
                  className="input-masked"
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="card-cvc" className="text-lg font-medium">
              CVC
            </Label>
            <Controller
              name="cvc"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  {...field}
                  id="card-cvc"
                  type="text"
                  placeholder="123"
                  className="input-masked"
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="card-name" className="text-lg font-medium">
              Name on Card
            </Label>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  {...field}
                  id="card-name"
                  type="text"
                  placeholder="John Doe"
                />
              )}
            />
          </div>
        </div>
      </>
    )}

    <Label htmlFor="email" className="text-lg font-medium">
      Email Address
    </Label>
    <Controller
      name="email"
      control={control}
      defaultValue=""
      render={({ field }) => (
        <Input
          {...field}
          id="email"
          type="email"
          placeholder="your@email.com"
        />
      )}
    />
    {errors.email && (
      <p className="text-destructive text-sm">{errors.email.message}</p>
    )}

    <Label htmlFor="shipping_address" className="text-lg font-medium">
      Shipping Address
    </Label>
    <Controller
      name="shipping_address"
      control={control}
      defaultValue=""
      render={({ field }) => (
        <Textarea
          {...field}
          id="shipping_address"
          placeholder="Enter your full shipping address, including street name, house number, city, and any landmarks for easy location."
          rows={4}
        />
      )}
    />
    {errors.shipping_address && (
      <p className="text-destructive text-sm">
        {errors.shipping_address.message}
      </p>
    )}
  </div>
);

export default function PaymentDialog({
  onPaymentComplete,
  amount = 2000,
  paymentMethods = ["credit-card", "orange-money", "mtn-money", "paypal"],
  triggerButtonText = "Pay Now",
}) {
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { cart } = useCart();
  console.log("this is the cart: ", cart);
  const { currency, convertCurrency } = useCurrency();
  const paymentWindowRef = useRef(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(paymentSchema),
    mode: "onChange",
  });

  const initializePayment = async (orderData) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/content/orders/`;
    try {
      const orderResponse = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        throw new Error("Order creation failed , or product stock expired");
      }

      return await orderResponse.json();
    } catch (error) {
      console.error("Error in payment process:", error);
      throw error;
    }
  };

  const onSubmit = async (data) => {
    console.log(data);
    setIsProcessing(true);
    try {
      const newCart = cart.map((item) => ({ ...item, product: item.id }));
      const orderData = {
        ...data,
        items: newCart,
        pay_on_delivery: false,
      };

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const result = await initializePayment(orderData);

      console.log(result);

      if (result.order && result.payment_link) {
        // Open a new tab with the payment link
        paymentWindowRef.current = window.open(result.payment_link, "_blank");
        if (!paymentWindowRef.current) {
          throw new Error(
            "Unable to open payment window. Please check your popup blocker settings."
          );
        }
      } else {
        throw new Error("Payment link not found in the response");
      }

      toast.success("Payment initiated successfully!", {
        duration: 5000,
        icon: "🎉",
      });
      onPaymentComplete && onPaymentComplete(paymentMethod, result);
      setIsSheetOpen(false);
    } catch (error) {
      console.error("Error in payment process:", error);
      toast.error(
        error.message || "Payment initiation failed. Please try again.",
        {
          duration: 5000,
          icon: "❌",
        }
      );
      if (paymentWindowRef.current) {
        paymentWindowRef.current.close();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethodIcons = {
    "orange-money": DollarSign,
    "mtn-money": Mountain,
    "credit-card": CreditCard,
    paypal: ShoppingCart,
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button className="w-full">{triggerButtonText}</Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[400px] sm:w-[540px] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
          className="h-full flex flex-col py-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 flex-grow">
            <div className="space-y-6">
              <motion.h3
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-center">
                Secure Payment
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl font-semibold text-primary text-center">
                Total:{" "}
                {Number(convertCurrency(amount, "XAF", currency)).toFixed(2)}{" "}
                {currency}
              </motion.p>
              <Controller
                name="paymentMethod"
                control={control}
                defaultValue={paymentMethod}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    onValueChange={(value) => {
                      setPaymentMethod(value);
                      field.onChange(value);
                      reset();
                    }}
                    className="grid grid-cols-2 gap-4">
                    {paymentMethods.map((method, index) => {
                      const Icon = paymentMethodIcons[method];
                      return (
                        <motion.div
                          key={method}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}>
                          <RadioGroupItem
                            id={method}
                            value={method}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={method}
                            className="flex flex-col items-center gap-2 border-2 rounded-lg p-4 cursor-pointer transition duration-300 ease-in-out hover:bg-accent peer-checked:border-primary peer-checked:bg-primary/10">
                            {Icon && <Icon className="w-8 h-8 text-primary" />}
                            <span className="capitalize text-sm font-medium text-center">
                              {method.replace("-", " ")}
                            </span>
                          </Label>
                        </motion.div>
                      );
                    })}
                  </RadioGroup>
                )}
              />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={paymentMethod}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6">
                <PaymentForm
                  control={control}
                  errors={errors}
                  paymentMethod={paymentMethod}
                />
              </motion.div>
            </AnimatePresence>
            <div className="mt-8 flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSheetOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isProcessing}
                className={isProcessing ? "opacity-70 cursor-not-allowed" : ""}>
                {isProcessing ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full"
                    />
                    <span>Processing...</span>
                  </motion.div>
                ) : (
                  "Complete Payment"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
