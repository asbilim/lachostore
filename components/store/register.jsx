import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Toaster, toast } from "sonner";
import Image from "next/image";

// Define individual schemas for each step
const basicInfoSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  slug: z.string().optional(),
});

const contactDetailsSchema = z.object({
  contact_email: z.string().email("Invalid email address"),
  contact_phone: z.string().min(1, "Contact phone is required"),
  address: z.string().min(1, "Address is required"),
});

const socialMediaSchema = z.object({
  social_media_links: z
    .object({
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      twitter: z.string().optional(),
    })
    .optional(),
});

const operatingDetailsSchema = z.object({
  operating_hours: z.string().min(1, "Operating hours are required"),
  description: z.string().min(1, "Description is required"),
});

const avatarUploadSchema = z.object({
  avatar: z.any().optional(),
});

const locationSchema = z.object({
  geo_location: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
});

const EnhancedStoreRegistration = ({ staticText }) => {
  // State management
  const [currentStep, setCurrentStep] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const steps = staticText.steps;
  const popupRef = useRef(null);

  // Schema and form setup
  const schemaForStep = [
    basicInfoSchema,
    contactDetailsSchema,
    socialMediaSchema,
    operatingDetailsSchema,
    avatarUploadSchema,
    locationSchema,
  ];

  const form = useForm({
    resolver: zodResolver(schemaForStep[currentStep]),
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
      contact_email: "",
      contact_phone: "",
      address: "",
      social_media_links: {
        facebook: "",
        instagram: "",
        twitter: "",
      },
      operating_hours: "",
      description: "",
      avatar: "",
      geo_location: null,
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  // Form submission logic
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      const combinedData = { ...form.getValues(), ...data };

      Object.entries(combinedData).forEach(([key, value]) => {
        if (key === "avatar" && avatarFile) {
          formData.append(key, avatarFile);
        } else if (value !== null) {
          formData.append(
            key,
            typeof value === "object" ? JSON.stringify(value) : value
          );
        }
      });

      // No longer need popup window for payment
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/store/create/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      // Store created successfully
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Store creation error:", error);
      setErrorMessage(
        error.response?.data?.error ||
          error.message ||
          "An unexpected error occurred during store creation."
      );
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step navigation logic
  const handleNextStep = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      if (currentStep === steps.length - 1) {
        handleSubmit(onSubmit)();
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    } else {
      toast.error(staticText.messages.validationError);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    if (currentStep === steps.length - 1 && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setValue("geo_location", { lat: latitude, lng: longitude });
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          toast.error(staticText.messages.locationError);
        }
      );
    }
  }, [currentStep, userLocation, setValue]);

  // Dropzone handling
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setAvatarFile(file);
    const fileUrl = URL.createObjectURL(file);
    setValue("avatar", fileUrl);
    toast.success(staticText.messages.imageUploadedDescription);
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: { "image/*": [] },
      multiple: false,
    });

  return (
    <>
      <Toaster position="top-center" />
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
                  {/* Step 1: Basic Info */}
                  {currentStep === 0 && (
                    <>
                      <FormField
                        control={control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{staticText.labels.storeName}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
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
                            <FormLabel>{staticText.labels.slug}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={staticText.placeholders.slug}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* Step 2: Contact Details */}
                  {currentStep === 1 && (
                    <>
                      <FormField
                        control={control}
                        name="contact_email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {staticText.labels.contactEmail}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={
                                  staticText.placeholders.contactEmail
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="contact_phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {staticText.labels.contactPhone}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={
                                  staticText.placeholders.contactPhone
                                }
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
                            <FormLabel>{staticText.labels.address}</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder={staticText.placeholders.address}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* Step 3: Social Media */}
                  {currentStep === 2 && (
                    <>
                      <FormField
                        control={control}
                        name="social_media_links.facebook"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{staticText.labels.facebook}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={staticText.placeholders.facebook}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="social_media_links.instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{staticText.labels.instagram}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={staticText.placeholders.instagram}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="social_media_links.twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{staticText.labels.twitter}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={staticText.placeholders.twitter}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* Step 4: Operating Details */}
                  {currentStep === 3 && (
                    <>
                      <FormField
                        control={control}
                        name="operating_hours"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {staticText.labels.operatingHours}
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
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
                            <FormLabel>
                              {staticText.labels.description}
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder={
                                  staticText.placeholders.description
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* Step 5: Avatar Upload */}
                  {currentStep === 4 && (
                    <FormField
                      control={control}
                      name="avatar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{staticText.labels.avatar}</FormLabel>
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
                                  width={128}
                                  height={128}
                                  unoptimized
                                />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Step 6: Location */}
                  {currentStep === 5 && (
                    <FormField
                      control={control}
                      name="geo_location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{staticText.labels.geoLocation}</FormLabel>
                          <FormDescription>
                            {staticText.messages.locationDescription}
                          </FormDescription>
                          <FormControl>
                            <Input
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
            </form>
          </Form>
        </CardContent>
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
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : staticText.buttons.submit}
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{"Store Created Successfully"}</DialogTitle>
            <DialogDescription>
              {
                "Your store has been created successfully and is now active. You can start adding products and customizing your store."
              }
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 space-y-2">
            <h3 className="font-medium">Next Steps:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Add products to your store</li>
              <li>Complete your store profile</li>
              <li>Set up your preferred payment methods</li>
              <li>Share your store on social media</li>
            </ul>
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/en/accounts/");
              }}>
              Go to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{"We could not create your store"}</DialogTitle>
            <DialogDescription>
              {errorMessage || "We had a problem creating your store"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowErrorModal(false)}>
              {"Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnhancedStoreRegistration;
