import { useState } from "react";
import { useForm } from "react-hook-form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Star,
  ArrowRight,
  Package,
  Clipboard,
  MessageSquare,
  Send,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ProductDetails = ({ product, translations }) => {
  const [activeTab, setActiveTab] = useState("description");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Here you would typically send the review to your backend
    reset();
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
          <ReviewForm
            onSubmit={onSubmit}
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Description = ({ product, translations }) => {
  const features = product?.features || ["new", "rare", "styled", "unnique"];
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

const Reviews = ({ product }) => (
  <Card>
    <CardContent className="p-6">
      <h3 className="text-2xl font-semibold mb-4">Customer Reviews</h3>
      <div className="flex items-center gap-4 mb-6">
        <div className="text-5xl font-bold">{product.rating.toFixed(1)}</div>
        <div className="flex-grow">
          <div className="flex items-center mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= product.rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600">
            Based on {product.reviewCount} reviews
          </p>
          <div className="mt-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="w-2">{rating}</span>
                <Progress
                  value={product.ratingDistribution[rating]}
                  className="h-2"
                />
                <span className="text-sm text-gray-600">
                  {product.ratingDistribution[rating]}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {product.reviews.map((review, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Avatar>
                  <AvatarImage src={review.avatar} alt={review.name} />
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
      <Button variant="outline" className="mt-6 w-full">
        See all reviews <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
    </CardContent>
  </Card>
);

const ReviewForm = ({ onSubmit, register, errors, handleSubmit }) => (
  <Card className="mt-8">
    <CardContent className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-2xl font-semibold mb-4">Write a Review</h3>

        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register("name", { required: "Name is required" })}
            className="mt-1"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className="mt-1"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label>Rating</Label>
          <RadioGroup defaultValue="5" className="flex space-x-4 mt-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <div key={value} className="flex items-center">
                <RadioGroupItem
                  value={value.toString()}
                  id={`rating-${value}`}
                  {...register("rating", { required: "Rating is required" })}
                />
                <Label htmlFor={`rating-${value}`} className="ml-2">
                  <Star
                    className={`w-5 h-5 ${
                      value <= 5
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </Label>
              </div>
            ))}
          </RadioGroup>
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="comment">Review</Label>
          <Textarea
            id="comment"
            {...register("comment", { required: "Review comment is required" })}
            className="mt-1"
            rows={4}
          />
          {errors.comment && (
            <p className="text-red-500 text-sm mt-1">
              {errors.comment.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full flex items-center justify-center gap-2">
          Submit Review
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </CardContent>
  </Card>
);

export default ProductDetails;
