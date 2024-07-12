"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCart } from "@/providers/cart";
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
import { Separator } from "@/components/ui/separator";

export const CheckoutPage = ({
  checkout,
  cart_text,
  description,
  empty,
  empty_description,
  subtotal_text,
  shipping_text,
  total_text,
  button,
  shipping_payment,
  shipping_description,
  last_button,
  validationMessages,
  labels,
}) => {
  const { cart, updateQuantity, removeFromCart, totalItems, totalPrice } =
    useCart();

  const formSchema = z.object({
    fullName: z.string().min(2, { message: validationMessages.fullName }),
    email: z.string().email({ message: validationMessages.email }),
    address: z.string().min(5, { message: validationMessages.address }),
    city: z.string().min(2, { message: validationMessages.city }),
    postalCode: z.string().min(3, { message: validationMessages.postalCode }),
    paymentMethod: z.enum(["card", "orange", "mtn"]),
    phoneNumber: z
      .string()
      .optional()
      .refine((val) => !val || /^\d{9,}$/.test(val), {
        message: validationMessages.phoneNumber,
      }),
    cardNumber: z
      .string()
      .optional()
      .refine((val) => !val || /^\d{16}$/.test(val), {
        message: validationMessages.cardNumber,
      }),
    cardExpiry: z
      .string()
      .optional()
      .refine((val) => !val || /^(0[1-9]|1[0-2])\/\d{2}$/.test(val), {
        message: validationMessages.cardExpiry,
      }),
    cardCVC: z
      .string()
      .optional()
      .refine((val) => !val || /^\d{3,4}$/.test(val), {
        message: validationMessages.cardCVC,
      }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
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
    mode: "onChange",
  });

  const watchPaymentMethod = form.watch("paymentMethod");

  const onSubmit = (data) => {
    console.log(data);
    // Handle checkout logic here
  };

  const handleQuantityChange = (id, newQuantity) => {
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  const subtotal = totalPrice;
  const shipping = 5.99;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto overflow-x-hidden flex items-center w-full justify-center flex-col py-8">
      <h1 className="text-3xl font-bold mb-8">{checkout}</h1>
      <div className="grid lg:grid-cols-2 gap-8 px-4 w-full max-w-7xl">
        <Card>
          <CardHeader>
            <CardTitle>{cart_text}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <h3 className="text-xl font-semibold mb-2">{empty}</h3>
                <p className="text-gray-500">{empty_description}</p>
              </div>
            ) : (
              <ScrollArea className="h-[300px] rounded-md border p-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-4">
                    <div className="flex items-center space-x-4">
                      <Image
                        src={item.image || "https://placehold.co/400x600.png"}
                        alt={item.name}
                        className="w-16 h-16 rounded-md object-cover"
                        width={500}
                        height={500}
                      />
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          FCFA {parseFloat(item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Select
                        value={item.quantity.toString()}
                        onValueChange={(value) =>
                          handleQuantityChange(item.id, parseInt(value, 10))
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
                        onClick={() => handleRemoveItem(item.id)}>
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {subtotal_text}: XAF {parseFloat(subtotal).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                {shipping_text}: XAF {parseFloat(shipping).toFixed(2)}
              </p>
              <p className="font-semibold">
                {total_text}: XAF {parseFloat(total).toFixed(2)}
              </p>
            </div>
            <Button
              onClick={() => form.handleSubmit(onSubmit)()}
              disabled={cart.length === 0}>
              {button}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{shipping_payment}</CardTitle>
            <CardDescription>{shipping_description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{labels.fullName}</FormLabel>
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
                      <FormLabel>{labels.email}</FormLabel>
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
                      <FormLabel>{labels.address}</FormLabel>
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
                        <FormLabel>{labels.city}</FormLabel>
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
                        <FormLabel>{labels.postalCode}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Separator />
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{labels.paymentMethod}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1">
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="card" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {labels.creditCard}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="orange" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {labels.orangeMoney}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="mtn" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {labels.mtnMobileMoney}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {watchPaymentMethod === "card" && (
                  <>
                    <FormField
                      control={form.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{labels.cardNumber}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="1234 5678 9012 3456"
                            />
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
                            <FormLabel>{labels.cardExpiry}</FormLabel>
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
                            <FormLabel>{labels.cardCVC}</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="123" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}
                {(watchPaymentMethod === "orange" ||
                  watchPaymentMethod === "mtn") && (
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{labels.phoneNumber}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={labels.phoneNumberPlaceholder}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <Button type="submit" className="w-full">
                  {last_button}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

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

export default CheckoutPage;
