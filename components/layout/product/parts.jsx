"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Star,
  ArrowRight,
  Package,
  Clipboard,
  MessageSquare,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import ReviewForm from "./add-review";

export default function ProductDetails({ translations, product }) {
  const [activeTab, setActiveTab] = useState("description");
  const [submissionStatus, setSubmissionStatus] = useState({
    type: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmissionStatus({ type: "", message: "" });
    console.log(data);
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
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to submit review");
      }
      setSubmissionStatus({
        type: "success",
        message:
          "Your review has been successfully submitted. Thank you for your feedback!",
      });
      reset();
    } catch (error) {
      if (
        error.message ===
        "You have already submitted 3 reviews for this product."
      ) {
        setSubmissionStatus({
          type: "error",
          message:
            "You have reached the maximum number of reviews for this product.",
        });
      } else {
        setSubmissionStatus({
          type: "error",
          message: `Failed to submit review: ${error.message}`,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mt-12">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="description" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            {translations.description}
          </TabsTrigger>
          <TabsTrigger
            value="specifications"
            className="flex items-center gap-2">
            <Clipboard className="w-4 h-4" />
            {translations.specifications}
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            {translations.reviews}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Description product={product} translations={translations} />
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Specifications product={product} />
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Reviews product={product} />
          {submissionStatus.type && (
            <Alert
              variant={
                submissionStatus.type === "error" ? "destructive" : "default"
              }
              className="mb-4">
              <AlertTitle>
                {submissionStatus.type === "error" ? "Error" : "Success"}
              </AlertTitle>
              <AlertDescription>{submissionStatus.message}</AlertDescription>
            </Alert>
          )}
          <ReviewForm
            onSubmit={handleSubmit(onSubmit)}
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
            product={product}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const Description = ({ product, translations }) => {
  const features = product?.features || ["new", "rare", "styled", "unique"];
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-2xl font-semibold mb-4">
          {translations.description}
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {product.longDescription}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {features.map((feature, index) => (
            <Badge key={index} variant="secondary">
              {feature}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const Specifications = ({ product }) => (
  <Card>
    <CardContent className="p-6">
      <h3 className="text-2xl font-semibold mb-4">Specifications</h3>
      <div className="grid grid-cols-2 gap-4">
        {product.specifications.map((spec, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-gray-700">{spec}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const Reviews = ({ product }) => {
  if (!product) return null;

  const rating = product.rating || 0;
  const reviewCount = product.review_count || 0;
  const ratingDistribution = product.rating_distribution || {};

  const totalRatings = Object.values(ratingDistribution).reduce(
    (a, b) => a + b,
    0
  );
  const distributionPercentages = Object.entries(ratingDistribution).reduce(
    (acc, [rating, count]) => {
      acc[rating] = (count / totalRatings) * 100;
      return acc;
    },
    {}
  );

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-2xl font-semibold mb-4">Customer Reviews</h3>
        <div className="flex items-center gap-4 mb-6">
          <div className="text-5xl font-bold">{rating.toFixed(1)}</div>
          <div className="flex-grow">
            <div className="flex items-center mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Based on {reviewCount} reviews
            </p>
            <div className="mt-2">
              {[5, 4, 3, 2, 1].map((ratingValue) => (
                <div key={ratingValue} className="flex items-center gap-2">
                  <span className="w-2">{ratingValue}</span>
                  <Progress
                    value={distributionPercentages[ratingValue] || 0}
                    className="h-2"
                  />
                  <span className="text-sm text-gray-600">
                    {distributionPercentages[ratingValue]?.toFixed(0) || 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {product.reviews?.map((review, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar>
                    <AvatarFallback>{review.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{review.name}</p>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button
          variant="outline"
          className="mt-6 w-full"
          onClick={() => {
            document.location.reload();
          }}>
          Refresh reviews <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
};
