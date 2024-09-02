"use client";

import React, { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
    toast({
      title: "Form Submitted",
      description: "Your information has been successfully submitted.",
    });
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
    const cards = cardRefs.current;
    const form = formRef.current;

    cards.forEach((card, index) => {
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
      form,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        scrollTrigger: {
          trigger: form,
          start: "top 80%",
        },
      }
    );

    return () => {
      cards.forEach((card) => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.vars.trigger === card) {
            trigger.kill();
          }
        });
      });
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === form) {
          trigger.kill();
        }
      });
    };
  }, []);

  const controls = useAnimation();

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary text-foreground">
      <div className="min-h-screen flex flex-col justify-center items-center p-8">
        <motion.h2
          className="text-4xl font-bold mb-12 text-primary"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          {translations.sections.nutritionist.title}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          <AnimatePresence>
            {Object.entries(translations.sections.nutritionist.cards).map(
              ([key, cardData], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 50 }}
                  animate={controls}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}>
                  <Card
                    ref={(el) => (cardRefs.current[index] = el)}
                    className="h-full">
                    <CardHeader>
                      <CardTitle className="text-2xl font-semibold text-primary">
                        {cardData.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-4 space-y-2">
                        {cardData.items.map((item, idx) => (
                          <li key={idx} className="text-muted-foreground">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="min-h-screen flex justify-center items-center p-8">
        <Card className="w-full max-w-2xl" ref={formRef}>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">
              {translations.sections.form.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="space-y-6">
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(translations.sections.form.fields).map(
                  ([fieldName, fieldData], index) => (
                    <AccordionItem value={`item-${index}`} key={fieldName}>
                      <AccordionTrigger>{fieldData.label}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
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
                                            <SelectItem
                                              key={value}
                                              value={value}>
                                              {label}
                                            </SelectItem>
                                          )
                                        )}
                                      </SelectContent>
                                    </Select>
                                  );
                                case "exerciseFrequency":
                                  return (
                                    <div className="space-y-2">
                                      <Slider
                                        min={0}
                                        max={7}
                                        step={1}
                                        value={[field.value]}
                                        onValueChange={(value) =>
                                          field.onChange(value[0])
                                        }
                                      />
                                      <p className="text-sm text-muted-foreground">
                                        {field.value} days per week
                                      </p>
                                    </div>
                                  );
                                case "pregnancyStatus":
                                case "breastfeedingStatus":
                                  return (
                                    <div className="flex items-center space-x-2">
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                      <Label htmlFor={fieldName}>
                                        {field.value ? "Yes" : "No"}
                                      </Label>
                                    </div>
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
                                          <label htmlFor={option}>
                                            {option}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  );
                                case "appointmentDate":
                                  return (
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !field.value &&
                                              "text-muted-foreground"
                                          )}>
                                          <CalendarIcon className="mr-2 h-4 w-4" />
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent
                                        className="w-auto p-0"
                                        align="start">
                                        <Calendar
                                          mode="single"
                                          selected={field.value}
                                          onSelect={field.onChange}
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                  );
                                default:
                                  return null;
                              }
                            }}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                )}
              </Accordion>
              <div className="flex w-full">
                <PaymentDialog
                  type="submit"
                  className="w-full"
                  onPaymentComplete={(method, data) => {
                    console.log("Payment completed", method, data);
                    toast({
                      title: "Payment Successful",
                      description: `Your payment using ${method} has been processed.`,
                    });
                  }}>
                  {translations.sections.form.submitButton}
                </PaymentDialog>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
};

export default NutritionistShowcase;
