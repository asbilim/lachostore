"use client";

import React, { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, useAnimation } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomTimeInput from "./ui/custom-calendar";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import PaymentDialog from "./reusables/pay-modal";

gsap.registerPlugin(ScrollTrigger);

const schema = z.object({
  height: z
    .string()
    .refine((val) => !val || (Number(val) > 0 && Number(val) <= 300), {
      message: "Height must be a positive number up to 300 cm",
    }),
  appointmentDate: z.date().refine((date) => date > new Date(), {
    message: "Appointment date must be in the future",
  }),
  age: z
    .string()
    .refine((val) => !val || (Number(val) >= 18 && Number(val) <= 120), {
      message: "Age must be between 18 and 120",
    }),
  gender: z.string().optional(),
  exerciseFrequency: z
    .number()
    .transform(Number)
    .refine((val) => val >= 0 && val <= 7, {
      message: "Exercise frequency must be between 0 and 7 days per week",
    }),
  alcoholConsumption: z.string().optional(),
  smokingStatus: z.string().optional(),
  pregnancyStatus: z.boolean().optional(),
  breastfeedingStatus: z.boolean().optional(),
  digestiveIssues: z.array(z.string()).optional(),
  cookingSkills: z.string().optional(),
  mealPrepTime: z.string().optional(),
  budgetConstraints: z.string().optional(),
  foodPreferences: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  dietaryRestrictions: z.string().optional(),
  preferredMealTypes: z.array(z.string()).optional(),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(8, "Phone number must be at least 10 digits"),
});

const NutritionistShowcase = ({ locale, translations }) => {
  const { toast } = useToast();
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      height: undefined,
      age: undefined,
      gender: undefined,
      exerciseFrequency: 0,
      appointmentDate: null,
      alcoholConsumption: undefined,
      smokingStatus: undefined,
      pregnancyStatus: false,
      breastfeedingStatus: false,
      digestiveIssues: [],
      cookingSkills: undefined,
      mealPrepTime: undefined,
      budgetConstraints: undefined,
      foodPreferences: [],
      allergies: [],
      dietaryRestrictions: undefined,
      preferredMealTypes: [],
    },
    mode: "onChange",
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  const onError = (errors) => {
    Object.values(errors).forEach((error) => {
      toast({
        title: "Validation Error",
        description: error.message,
        variant: "destructive",
      });
    });
  };

  const cardRefs = useRef([]);
  const formRef = useRef();

  useEffect(() => {
    cardRefs.current.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
          },
        }
      );
    });

    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <div className="min-h-screen text-white">
      <div className="min-h-screen flex flex-col justify-center items-center p-8">
        <motion.h2
          className="text-4xl font-bold mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          {translations.sections.nutritionist.title}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          {Object.entries(translations.sections.nutritionist.cards).map(
            ([key, cardData], index) => (
              <React.Fragment key={key}>
                <Card ref={(el) => (cardRefs.current[index] = el)}>
                  <CardHeader>
                    <CardTitle>{cardData.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-4 space-y-2">
                      {cardData.items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </React.Fragment>
            )
          )}
        </div>
      </div>
      <div className="min-h-screen flex justify-center items-center p-8">
        <Card className="w-full max-w-2xl" ref={formRef}>
          <CardHeader>
            <CardTitle>{translations.sections.form.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="space-y-6 flex flex-col">
              {Object.entries(translations.sections.form.fields).map(
                ([fieldName, fieldData]) => (
                  <div key={fieldName} className="space-y-2">
                    <Label htmlFor={fieldName}>{fieldData.label}</Label>
                    <Controller
                      name={fieldName}
                      control={control}
                      render={({ field }) => {
                        switch (fieldName) {
                          case "fullName":
                          case "email":
                          case "phoneNumber":
                          case "height":
                          case "age":
                            return (
                              <Input
                                type={
                                  fieldName === "email"
                                    ? "email"
                                    : fieldName === "phoneNumber"
                                    ? "tel"
                                    : "text"
                                }
                                id={fieldName}
                                placeholder={fieldData.label}
                                {...field}
                              />
                            );
                          case "gender":
                          case "alcoholConsumption":
                          case "smokingStatus":
                          case "cookingSkills":
                          case "mealPrepTime":
                          case "budgetConstraints":
                          case "dietaryRestrictions":
                            return (
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={`Select ${fieldData.label}`}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(fieldData.options).map(
                                    ([value, label]) => (
                                      <SelectItem key={value} value={value}>
                                        {label}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            );
                          case "exerciseFrequency":
                            return (
                              <Slider
                                min={0}
                                max={7}
                                step={1}
                                value={[field.value]}
                                onValueChange={(value) =>
                                  field.onChange(value[0])
                                }
                              />
                            );
                          case "pregnancyStatus":
                          case "breastfeedingStatus":
                            return (
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            );
                          case "digestiveIssues":
                          case "foodPreferences":
                          case "allergies":
                          case "preferredMealTypes":
                            return (
                              <div className="space-y-2">
                                {fieldData.options.map((option) => (
                                  <div
                                    key={option}
                                    className="flex items-center space-x-2">
                                    <Checkbox
                                      id={option}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          field.onChange([
                                            ...field.value,
                                            option,
                                          ]);
                                        } else {
                                          field.onChange(
                                            field.value.filter(
                                              (i) => i !== option
                                            )
                                          );
                                        }
                                      }}
                                    />
                                    <label htmlFor={option}>{option}</label>
                                  </div>
                                ))}
                              </div>
                            );
                          default:
                            return null;
                        }
                      }}
                    />
                  </div>
                )
              )}
              <Label htmlFor="appointmentDate">
                {translations.sections.form.fields.appointmentDate.label}
              </Label>
              <Controller
                name="appointmentDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minDate={new Date()}
                    className={cn(
                      "w-full p-2 rounded-md border",
                      "bg-background text-foreground",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
                    )}
                    placeholderText={
                      translations.sections.form.fields.appointmentDate
                        .placeholder
                    }
                    customTimeInput={<CustomTimeInput />}
                    popperClassName="react-datepicker-popper"
                    calendarClassName="bg-background border border-input rounded-md shadow-md"
                    dayClassName={(date) =>
                      cn(
                        "rounded-full hover:bg-accent hover:text-accent-foreground",
                        "mx-1 py-1.5 px-2"
                      )
                    }
                  />
                )}
              />
              <div className="flex w-full">
                <PaymentDialog
                  type="submit"
                  className="w-full"
                  onPaymentComplete={(method, data) => {
                    console.log("Payment completed", method, data);
                  }}>
                  {translations.sections.form.submitButton}
                </PaymentDialog>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NutritionistShowcase;
