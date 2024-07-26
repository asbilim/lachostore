"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";

export default function ResetPasswordComponent() {
  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (data) => {
    // Here you would typically:
    // 1. Validate that password and confirmPassword match
    // 2. Send a request to your API to reset the password
    // 3. Handle the response (success or error)

    console.log("Password reset data:", data);

    // Simulate a successful password reset
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Redirect to login page after successful reset
    router.push("/login");
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <h1 className="text-3xl font-bold text-center">Reset Password</h1>
          <p className="text-muted-foreground text-center">
            Enter your new password below
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                rules={{ required: "New password is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                rules={{
                  required: "Please confirm your new password",
                  validate: (value) =>
                    value === form.getValues("password") ||
                    "Passwords do not match",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Reset Password
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm">
            Remember your password?{" "}
            <Link href="/login" className="text-primary underline">
              Back to login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
