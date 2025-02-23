"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/providers/cart";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreditCard, DollarSign, Mountain, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useCurrency } from "@/providers/currency";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Zod schema for payment fields (unchanged)
const paymentSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email("Invalid email address"),
  shipping_address: z
    .string()
    .min(10, "Please provide a detailed shipping address"),
});

// Reusable PaymentForm component (unchanged)
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
          placeholder="Enter your full shipping address, including street name, house number, city, and any landmarks."
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
  paymentMethods = ["orange-money", "mtn-money", "credit-card", "paypal"],
  triggerButtonText = "Pay Now",
}) {
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [paymentLink, setPaymentLink] = useState(null);
  const [countdown, setCountdown] = useState(5); // Countdown starts at 5 seconds
  const { cart } = useCart();
  const { currency, convertCurrency } = useCurrency();
  const paymentWindowRef = useRef(null);
  const toastIdRef = useRef(null); // To manage the toast

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(paymentSchema),
    mode: "onChange",
  });

  const paymentMethodIcons = {
    "orange-money": DollarSign,
    "mtn-money": Mountain,
    "credit-card": CreditCard,
    paypal: ShoppingCart,
  };

  const initializePayment = async (orderData) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/content/orders/`;
    try {
      const orderResponse = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || "Order creation failed");
      }

      return await orderResponse.json();
    } catch (error) {
      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        console.error("CORS error or network issue:", error);
        throw new Error(
          "Unable to connect to the server. Please check your internet connection or try again later."
        );
      }
      console.error("Error in payment process:", error);
      throw error;
    }
  };

  const onSubmit = async (data) => {
    setIsProcessing(true);

    try {
      const newCart = cart.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price?.toString() ?? "0",
        sale_price: item.sale_price?.toString() ?? null,
        color: item.color || "",
        size: item.size || "",
      }));

      const referralCode =
        cart.length > 0 && cart[0].referral_code ? cart[0].referral_code : null;

      const orderData = {
        email: data.email,
        shipping_address: data.shipping_address,
        pay_on_delivery: false,
        items: newCart,
        referral_code: referralCode,
      };

      console.log("Sending orderData:", orderData);
      const result = await initializePayment(orderData);
      console.log("Payment init result:", result);

      if (result.order && result.payment_link) {
        console.log("Setting paymentLink:", result.payment_link);
        setPaymentLink(result.payment_link);

        // Show toast with countdown
        setCountdown(5); // Reset countdown
        toastIdRef.current = toast.success(
          `Payment initiated successfully! Redirecting in ${countdown} seconds...`,
          {
            duration: Infinity, // Keep toast open until manually closed or redirected
            action: {
              label: "Cancel",
              onClick: () => {
                setPaymentLink(null);
                toast.dismiss(toastIdRef.current);
                toast.info("Payment process cancelled.", {
                  duration: 3000,
                  icon: "ℹ️",
                });
              },
            },
          }
        );
      } else {
        throw new Error("Payment link not found in response.");
      }

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
      if (paymentWindowRef.current) paymentWindowRef.current.close();
    } finally {
      setIsProcessing(false);
    }
  };

  // Countdown logic
  useEffect(() => {
    if (paymentLink && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          const newCountdown = prev - 1;
          if (toastIdRef.current) {
            toast.success(
              `Payment initiated successfully! Redirecting in ${newCountdown} seconds...`,
              {
                id: toastIdRef.current,
                duration: Infinity,
                action: {
                  label: "Cancel",
                  onClick: () => {
                    setPaymentLink(null);
                    toast.dismiss(toastIdRef.current);
                    toast.info("Payment process cancelled.", {
                      duration: 3000,
                      icon: "ℹ️",
                    });
                  },
                },
              }
            );
          }
          return newCountdown;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else if (paymentLink && countdown === 0) {
      // Redirect when countdown reaches zero
      handleProceedToPayment();
      toast.dismiss(toastIdRef.current);
    }
  }, [paymentLink, countdown]);

  const handleProceedToPayment = () => {
    if (paymentLink) {
      const paymentWindow = window.open(paymentLink, "_blank");
      if (!paymentWindow) {
        toast.error(
          "Unable to open payment window. Check your popup blocker settings.",
          {
            duration: 5000,
            icon: "❌",
          }
        );
      } else {
        setPaymentLink(null);
        toast.dismiss(toastIdRef.current); // Dismiss the toast
      }
    }
  };

  const handleCancelPayment = () => {
    setPaymentLink(null);
    toast.dismiss(toastIdRef.current); // Dismiss the toast
    toast.info("Payment process cancelled.", { duration: 3000, icon: "ℹ️" });
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
                      if (value === "credit-card" || value === "paypal") {
                        toast.error(
                          "Currently, only payments within Cameroon are available. Please select Orange Money or MTN Money.",
                          { duration: 5000, icon: "ℹ️" }
                        );
                        return;
                      }
                      setPaymentMethod(value);
                      field.onChange(value);
                      reset();
                    }}
                    className="grid grid-cols-2 gap-4">
                    {paymentMethods.map((method, index) => {
                      const Icon = paymentMethodIcons[method];
                      const isDisabled =
                        method === "credit-card" || method === "paypal";
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
                            disabled={isDisabled}
                          />
                          <Label
                            htmlFor={method}
                            className={`flex flex-col items-center gap-2 border-2 rounded-lg p-4 cursor-pointer transition duration-300 ease-in-out hover:bg-accent peer-checked:border-primary peer-checked:bg-primary/10 ${
                              isDisabled ? "opacity-50 cursor-not-allowed" : ""
                            }`}>
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

          {paymentLink && (
            <Dialog
              open={!!paymentLink}
              onOpenChange={(open) => !open && handleCancelPayment()}>
              <DialogContent className="sm:max-w-md fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-50 p-6 rounded-lg shadow-lg">
                <div className="text-center max-w-md">
                  <h3 className="text-2xl font-bold mb-6">Confirm Payment</h3>
                  <p className="mb-6 text-lg">
                    Redirecting in {countdown} seconds. Proceed to payment now?
                  </p>
                  <p className="text-sm text-muted-foreground mb-8">
                    Payment URL: {paymentLink}
                  </p>
                  <DialogFooter className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      onClick={handleCancelPayment}
                      className="px-6 py-3">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleProceedToPayment}
                      className="px-6 py-3 bg-primary text-white hover:bg-primary/90">
                      Proceed Now
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
