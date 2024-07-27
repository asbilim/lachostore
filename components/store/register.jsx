"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

const storeSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  slug: z.string().optional(),
  address: z.string().optional(),
  contactEmail: z.string().email("Invalid email address").optional(),
  contactPhone: z.string().optional(),
  operatingHours: z.string().optional(),
  socialMediaLinks: z
    .string()
    .optional()
    .refine((val) => {
      try {
        const parsed = JSON.parse(val);
        return typeof parsed === "object" && parsed !== null;
      } catch {
        return false;
      }
    }, "Invalid JSON for social media links"),
  avatar: z.string().optional(),
  website: z.string().url("Invalid URL").optional(),
  geoLocation: z
    .object({
      lat: z.number().optional(),
      lng: z.number().optional(),
    })
    .optional(),
});

const steps = [
  "Basic Info",
  "Contact Details",
  "Online Presence",
  "Operating Details",
  "Terms & Conditions",
  "Location",
];

export default function EnhancedStoreRegistration() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userLocation, setUserLocation] = useState(null);

  const form = useForm({
    resolver: zodResolver(storeSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
      address: "",
      contactEmail: "",
      contactPhone: "",
      operatingHours: "",
      socialMediaLinks: "{}",
      avatar: "",
      website: "",
      geoLocation: null,
    },
  });

  const { control, handleSubmit, trigger, getValues, setValue, formState } =
    form;

  const onSubmit = (data) => {
    console.log(data);
    toast.success("Form submitted successfully!");
  };

  const handleNextStep = async () => {
    const isValid = await trigger(); // Trigger validation

    if (isValid) {
      if (currentStep === 5 && !userLocation) {
        // Fetch user location if on the location step and not already done
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setValue("geoLocation", {
              lat: latitude,
              lng: longitude,
            });
            setUserLocation({ lat: latitude, lng: longitude });
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
          },
          (error) => {
            toast.error("Unable to retrieve your location.");
          }
        );
      } else {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      }
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));

      toast.error("Please correct the errors before proceeding.");
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    if (currentStep === steps.length - 1 && !userLocation) {
      // Automatically fetch location when reaching the location step
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setValue("geoLocation", {
            lat: latitude,
            lng: longitude,
          });
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          toast.error("Unable to retrieve your location.");
        }
      );
    }
  }, [currentStep, userLocation, setValue]);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    // Set the file URL in the form
    const fileUrl = URL.createObjectURL(file);
    setValue("avatar", fileUrl);
    toast.success("Image uploaded successfully!");
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: "image/*",
      multiple: false,
    });

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-md border rounded-lg ">
      <CardHeader>
        <CardTitle>Register Your Store</CardTitle>
        <CardDescription>
          Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}>
              {currentStep === 0 && (
                <>
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="name">Store Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="name"
                            placeholder="e.g., My Cool Store"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="slug">Slug</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="slug"
                            placeholder="e.g., my-cool-store"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {currentStep === 1 && (
                <>
                  <FormField
                    control={control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="contactEmail">
                          Contact Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="contactEmail"
                            placeholder="e.g., contact@example.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="contactPhone">
                          Contact Phone
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="contactPhone"
                            placeholder="e.g., (123) 456-7890"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="address">Address</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            id="address"
                            placeholder="e.g., 123 Main St"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {currentStep === 2 && (
                <>
                  <FormField
                    control={control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="website">Website</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="website"
                            placeholder="e.g., https://example.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="socialMediaLinks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="socialMediaLinks">
                          Social Media Links (JSON)
                        </FormLabel>
                        <FormDescription>
                          Provide social media links in JSON format. Example:{" "}
                          {'{"facebook": "https://facebook.com/yourpage"}'}
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            {...field}
                            id="socialMediaLinks"
                            placeholder='{"facebook": "https://facebook.com/yourpage"}'
                            onChange={(e) => {
                              const value = e.target.value;
                              setValue("socialMediaLinks", value);
                              trigger("socialMediaLinks");
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {currentStep === 3 && (
                <>
                  <FormField
                    control={control}
                    name="operatingHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="operatingHours">
                          Operating Hours
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            id="operatingHours"
                            placeholder="e.g., Mon-Fri 9am-5pm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {currentStep === 4 && (
                <FormField
                  control={control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="avatar">Avatar</FormLabel>
                      <FormControl>
                        <div
                          {...getRootProps({
                            className: `border-dashed border-2 p-4 flex flex-col items-center justify-center ${
                              isDragActive ? "bg-gray-200" : ""
                            } ${isDragReject ? "bg-red-200" : ""}`,
                          })}>
                          <input {...getInputProps()} />
                          <p>
                            {isDragActive
                              ? "Drop the image here..."
                              : isDragReject
                              ? "Unsupported file type..."
                              : "Drag & drop an image here, or click to select one"}
                          </p>
                          {field.value && (
                            <img
                              src={field.value}
                              alt="Avatar"
                              className="mt-4 w-32 h-32 object-cover"
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {currentStep === 5 && (
                <FormField
                  control={control}
                  name="geoLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="geoLocation">Location</FormLabel>
                      <FormDescription>
                        Your current location is used to set the {"store's"}
                        location.
                      </FormDescription>
                      <FormControl>
                        <Input
                          id="geoLocation"
                          value={
                            field.value
                              ? `Latitude: ${field.value.lat}, Longitude: ${field.value.lng}`
                              : "Fetching location..."
                          }
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </motion.div>
            <CardFooter className="flex justify-between">
              {currentStep > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousStep}>
                  Previous
                </Button>
              )}
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={handleNextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
