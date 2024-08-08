"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../ui/use-toast"; // Update the path if necessary
import { useDropzone } from "react-dropzone";
import axios from "axios";

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
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import Image from "next/image";

// Static text object for easy editing

// Define schemas for form validation
const basicInfoSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  slug: z.string().optional(),
});

const contactDetailsSchema = z.object({
  contactEmail: z.string().email("Invalid email address").optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
});

const onlinePresenceSchema = z.object({
  website: z.string().url("Invalid URL").optional(),
  facebook: z.string().url("Invalid URL").optional(),
  instagram: z.string().url("Invalid URL").optional(),
  twitter: z.string().url("Invalid URL").optional(),
});

const operatingDetailsSchema = z.object({
  operatingHours: z.string().optional(),
  description: z.string().optional(),
});

const avatarSchema = z.object({
  avatar: z.any().optional(),
});

const locationSchema = z.object({
  geoLocation: z
    .object({
      lat: z.number().optional(),
      lng: z.number().optional(),
    })
    .optional(),
});

// Steps for form progression

const EnhancedStoreRegistration = ({ staticText }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [formData, setFormData] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const { toast } = useToast();
  const steps = staticText.steps;

  const stepSchemas = [
    basicInfoSchema,
    contactDetailsSchema,
    onlinePresenceSchema,
    operatingDetailsSchema,
    avatarSchema,
    locationSchema,
  ];

  const currentSchema = stepSchemas[currentStep];

  const form = useForm({
    resolver: zodResolver(currentSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
      address: "",
      contactEmail: "",
      contactPhone: "",
      operatingHours: "",
      facebook: "",
      instagram: "",
      twitter: "",
      avatar: "",
      website: "",
      geoLocation: null,
      description: "",
    },
  });

  const { control, handleSubmit, trigger, getValues, setValue, formState } =
    form;

  const onSubmit = async () => {
    try {
      const combinedData = { ...formData, ...getValues() };
      const formDataToSend = new FormData();
      Object.entries(combinedData).forEach(([key, value]) => {
        if (key === "avatar" && avatarFile) {
          formDataToSend.append(key, avatarFile);
        } else if (typeof value === "object" && value !== null) {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value);
        }
      });

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/store/create/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast({
        title: staticText.messages.successTitle,
        description: staticText.messages.successDescription,
        status: "success",
      });
    } catch (error) {
      toast({
        title: staticText.messages.errorTitle,
        description: staticText.messages.errorDescription,
        status: "error",
      });
    }
  };

  const handleNextStep = async () => {
    const isValid = await trigger(); // Trigger validation for current step

    if (isValid) {
      setFormData({ ...formData, ...getValues() });
      if (currentStep === steps.length - 1) {
        // Submit the form if it's the last step
        handleSubmit(onSubmit)();
      } else {
        // Otherwise, move to the next step
        setCurrentStep((prev) => prev + 1);
      }
    } else {
      toast({
        title: staticText.messages.validationError,
        description: staticText.messages.validationError,
        status: "error",
      });
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
          toast({
            title: staticText.messages.locationError,
            description: staticText.messages.locationError,
            status: "error",
          });
        }
      );
    }
  }, [currentStep, userLocation, setValue]);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setAvatarFile(file);
    // Set the file URL in the form
    const fileUrl = URL.createObjectURL(file);
    setValue("avatar", fileUrl);
    toast({
      title: staticText.messages.imageUploadedTitle,
      description: staticText.messages.imageUploadedDescription,
      status: "success",
    });
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: "image/*",
      multiple: false,
    });

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-md border rounded-lg overflow-hidden">
      <CardHeader>
        <CardTitle>{staticText.cardTitle}</CardTitle>
        <CardDescription>
          Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}>
                {currentStep === 0 && (
                  <>
                    <FormField
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="name">
                            {staticText.labels.storeName}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id="name"
                              placeholder={staticText.placeholders.storeName}
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
                          <FormLabel htmlFor="slug">
                            {staticText.labels.slug}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id="slug"
                              placeholder={staticText.placeholders.slug}
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
                            {staticText.labels.contactEmail}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id="contactEmail"
                              placeholder={staticText.placeholders.contactEmail}
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
                            {staticText.labels.contactPhone}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id="contactPhone"
                              placeholder={staticText.placeholders.contactPhone}
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
                          <FormLabel htmlFor="address">
                            {staticText.labels.address}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              id="address"
                              placeholder={staticText.placeholders.address}
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
                          <FormLabel htmlFor="website">
                            {staticText.labels.website}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id="website"
                              placeholder={staticText.placeholders.website}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="facebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="facebook">
                            {staticText.labels.facebook}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id="facebook"
                              placeholder={staticText.placeholders.facebook}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="instagram">
                            {staticText.labels.instagram}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id="instagram"
                              placeholder={staticText.placeholders.instagram}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="twitter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="twitter">
                            {staticText.labels.twitter}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id="twitter"
                              placeholder={staticText.placeholders.twitter}
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
                            {staticText.labels.operatingHours}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              id="operatingHours"
                              placeholder={
                                staticText.placeholders.operatingHours
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="description">
                            {staticText.labels.description}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              id="description"
                              placeholder={staticText.placeholders.description}
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
                        <FormLabel htmlFor="avatar">
                          {staticText.labels.avatar}
                        </FormLabel>
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
                                : staticText.placeholders.avatar}
                            </p>
                            {field.value && (
                              <Image
                                src={field.value}
                                alt="Avatar"
                                className="mt-4 w-32 h-32 object-cover"
                                width={1000}
                                height={1000}
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
                        <FormLabel htmlFor="geoLocation">
                          {staticText.labels.geoLocation}
                        </FormLabel>
                        <FormDescription>
                          {staticText.messages.locationDescription}
                        </FormDescription>
                        <FormControl>
                          <Input
                            id="geoLocation"
                            value={
                              field.value
                                ? `Latitude: ${field.value.lat}, Longitude: ${field.value.lng}`
                                : staticText.messages.fetchingLocation
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
            </AnimatePresence>
            <CardFooter className="flex justify-between">
              {currentStep > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousStep}>
                  {staticText.buttons.previous}
                </Button>
              )}
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={handleNextStep}>
                  {staticText.buttons.next}
                </Button>
              ) : (
                <Button type="button" onClick={handleNextStep}>
                  {staticText.buttons.submit}
                </Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EnhancedStoreRegistration;
