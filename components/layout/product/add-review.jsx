"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Star } from "lucide-react";
import * as z from "zod";
import { useState } from "react";

// Zod schema definition
const reviewSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  rating: z.number().min(1, "Rating is required").max(5, "Invalid rating"),
  comment: z.string().min(1, "Review comment is required"),
});

const StarRating = ({ rating, onRatingChange }) => (
  <div className="flex items-center">
    {[1, 2, 3, 4, 5].map((star) => (
      <div key={star} className="relative">
        <Star
          className={`w-6 h-6 cursor-pointer ${
            rating >= star
              ? "text-yellow-400 fill-yellow-400"
              : rating >= star - 0.5
              ? "text-yellow-400"
              : "text-gray-300"
          }`}
          onClick={() => onRatingChange(star)}
        />
        <div
          className="absolute inset-0 right-1/2 cursor-pointer"
          onClick={() => onRatingChange(star - 0.5)}
        />
      </div>
    ))}
  </div>
);

export default function ReviewForm({ product }) {
  const [showPreview, setShowPreview] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState({
    type: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reviewSchema),
  });

  // Watch the rating value
  const ratingValue = watch("rating", 0);

  const handleRatingChange = (rating) => {
    setValue("rating", rating);
    if (errors.rating) {
      setValue("rating", rating, { shouldValidate: true });
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmissionStatus({ type: "", message: "" });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/store/api/products/${product?.id}/reviews/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to submit review");
      }

      setSubmissionStatus({
        type: "success",
        message:
          "Your review has been successfully submitted. Thank you for your feedback!",
      });
      setShowPreview(false);
      // Optionally, reset the form fields
      // reset();
    } catch (error) {
      setSubmissionStatus({
        type: "error",
        message: `Failed to submit review: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (data) => {
    if (showPreview) {
      onSubmit(data);
    } else {
      setShowPreview(true);
    }
  };

  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <h3 className="text-2xl font-semibold mb-4">Write a Review</h3>

          {!showPreview ? (
            <>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register("name")} className="mt-1" />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="mt-1"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Rating</Label>
                <StarRating
                  rating={ratingValue}
                  onRatingChange={handleRatingChange}
                />
                {errors.rating && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.rating.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="comment">Review</Label>
                <Textarea
                  id="comment"
                  {...register("comment")}
                  className="mt-1"
                  rows={4}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{watch("comment")?.length || 0} / 500 characters</span>
                  {errors.comment && (
                    <p className="text-red-500">{errors.comment.message}</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <Alert>
              <AlertTitle>Review Preview</AlertTitle>
              <AlertDescription>
                Please review your submission before confirming:
                <div className="mt-2">
                  <p>
                    <strong>Name:</strong> {watch("name")}
                  </p>
                  <p>
                    <strong>Email:</strong> {watch("email")}
                  </p>
                  <p>
                    <strong>Rating:</strong> {ratingValue} stars
                  </p>
                  <p>
                    <strong>Comment:</strong> {watch("comment")}
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-2"
            disabled={isSubmitting}>
            {showPreview ? "Confirm Submission" : "Preview Review"}
          </Button>

          {showPreview && (
            <Button
              type="button"
              variant="outline"
              className="w-full mt-2"
              onClick={() => setShowPreview(false)}
              disabled={isSubmitting}>
              Edit Review
            </Button>
          )}
        </form>

        {submissionStatus.message && (
          <Alert
            variant={
              submissionStatus.type === "error" ? "destructive" : "default"
            }
            className="mt-4">
            <AlertTitle>
              {submissionStatus.type === "error" ? "Error" : "Success"}
            </AlertTitle>
            <AlertDescription>{submissionStatus.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
