"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/server/add-to-newsletter";
import * as z from "zod";

export const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function NewsletterSubscribe({ placeholder, content }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(emailSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data) => {
    try {
      const response = await subscribeToNewsletter(data);
      if (response.success) {
        toast("Email added", {
          description: response.message,
        });
      } else {
        toast("Error during process", {
          description: response.message,
        });
      }
    } catch (error) {
      toast("Error during process", {
        description: "An unexpected error occurred.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
      <Input placeholder={placeholder} {...register("email")} />
      <Button type="submit" disabled={!!errors.email}>
        {content}
      </Button>
    </form>
  );
}
