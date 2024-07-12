"use client";

import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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

gsap.registerPlugin(ScrollTrigger);

const schema = z.object({
  date: z.date(),
  time: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  goals: z
    .string()
    .min(10, "Please provide at least 10 characters")
    .max(500, "Maximum 500 characters"),
  dietaryRestrictions: z.array(z.string()),
  currentWeight: z.number().min(30).max(300),
  targetWeight: z.number().min(30).max(300),
  height: z.number().min(100).max(250),
  age: z.number().min(18).max(120),
  gender: z.enum(["male", "female", "other"]),
  activityLevel: z.enum([
    "sedentary",
    "light",
    "moderate",
    "active",
    "very_active",
  ]),
  sleepQuality: z.number().min(1).max(10),
  stressLevel: z.number().min(1).max(10),
  waterIntake: z.number().min(0).max(5000),
  mealPreference: z.enum([
    "omnivore",
    "vegetarian",
    "vegan",
    "pescatarian",
    "keto",
    "paleo",
  ]),
  allergies: z.array(z.string()),
  medicalConditions: z.array(z.string()),
  supplementUse: z.boolean(),
  exerciseFrequency: z.number().min(0).max(7),
  alcoholConsumption: z.enum(["none", "occasional", "moderate", "heavy"]),
  smokingStatus: z.enum(["non_smoker", "former_smoker", "current_smoker"]),
  pregnancyStatus: z.boolean(),
  breastfeedingStatus: z.boolean(),
  digestiveIssues: z.array(z.string()),
  foodPreferences: z.array(z.string()),
  cookingSkills: z.enum(["beginner", "intermediate", "advanced"]),
  mealPrepTime: z.enum(["minimal", "moderate", "extensive"]),
  budgetConstraints: z.enum(["low", "medium", "high"]),
});

const nutrients = ["Protein", "Carbs", "Fats", "Fiber", "Vitamins", "Minerals"];

const services = [
  "Personalized Plans",
  "Nutrient Optimization",
  "Lifestyle Integration",
  "Gut Health",
  "Mindful Eating",
  "Supplement Guidance",
];

const NutritionistShowcase = () => {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      dietaryRestrictions: [],
      currentWeight: 70,
      targetWeight: 70,
      height: 170,
      age: 30,
      gender: "other",
      activityLevel: "moderate",
      sleepQuality: 5,
      stressLevel: 5,
      waterIntake: 2000,
      mealPreference: "omnivore",
      allergies: [],
      medicalConditions: [],
      supplementUse: false,
      exerciseFrequency: 3,
      alcoholConsumption: "occasional",
      smokingStatus: "non_smoker",
      pregnancyStatus: false,
      breastfeedingStatus: false,
      digestiveIssues: [],
      foodPreferences: [],
      cookingSkills: "intermediate",
      mealPrepTime: "moderate",
      budgetConstraints: "medium",
    },
  });

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 0, 0, 1]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [1, 0.8, 0.8, 1]
  );

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
  };

  const sectionRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  useEffect(() => {
    sectionRefs.forEach((ref, index) => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 via-emerald-600 to-teal-500 text-white">
      {/* ... Existing sections ... */}

      {/* New Section: Nutritionist Showcase */}
      <div
        className="min-h-screen flex flex-col justify-center items-center p-8 bg-gradient-to-br from-teal-600 via-green-500 to-lime-400"
        ref={sectionRefs[4]}>
        <h2 className="text-4xl font-bold mb-12">Meet Dr. Jane Doe</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          <Card className="bg-white/10 backdrop-blur-sm text-white">
            <CardHeader>
              <CardTitle>Education and Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 space-y-2">
                <li>PhD in Nutritional Sciences, Harvard University</li>
                <li>10+ years of clinical experience</li>
                <li>Research fellowship at Johns Hopkins University</li>
                <li>Former nutritionist for Olympic athletes</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm text-white">
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 space-y-2">
                <li>Certified Nutrition Specialist (CNS)</li>
                <li>Registered Dietitian Nutritionist (RDN)</li>
                <li>Certified Diabetes Educator (CDE)</li>
                <li>Sports Nutrition Specialist</li>
                <li>Precision Nutrition Level 2 Certified</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm text-white">
            <CardHeader>
              <CardTitle>Publications and Media</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 space-y-2">
                <li>Author of {"Eat Smart, Live Well"} bestseller</li>
                <li>Regular contributor to Nutrition Today journal</li>
                <li>Featured expert on National Health Radio</li>
                <li>
                  TEDx speaker on {"The Future of Personalized Nutrition"}
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm text-white">
            <CardHeader>
              <CardTitle>Specializations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 space-y-2">
                <li>Gut health and microbiome optimization</li>
                <li>Sports nutrition and performance enhancement</li>
                <li>Weight management and metabolic health</li>
                <li>Nutrigenomics and personalized nutrition</li>
                <li>Plant-based nutrition and sustainable eating</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Updated Form Section */}
      <div
        className="min-h-screen flex justify-center items-center p-8 bg-gradient-to-br from-lime-500 via-green-600 to-emerald-700"
        ref={sectionRefs[3]}>
        <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-sm text-white">
          <CardHeader>
            <CardTitle>Transform Your Health Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* ... Existing form fields ... */}

              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Controller
                  name="height"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      id="height"
                      {...field}
                      className="bg-white/10 text-white"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Controller
                  name="age"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      id="age"
                      {...field}
                      className="bg-white/10 text-white"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <SelectTrigger className="bg-white/10 text-white">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exerciseFrequency">
                  Exercise Frequency (days per week)
                </Label>
                <Controller
                  name="exerciseFrequency"
                  control={control}
                  render={({ field }) => (
                    <Slider
                      min={0}
                      max={7}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="bg-white/10"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alcoholConsumption">Alcohol Consumption</Label>
                <Controller
                  name="alcoholConsumption"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <SelectTrigger className="bg-white/10 text-white">
                        <SelectValue placeholder="Select alcohol consumption" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="occasional">Occasional</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="heavy">Heavy</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smokingStatus">Smoking Status</Label>
                <Controller
                  name="smokingStatus"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <SelectTrigger className="bg-white/10 text-white">
                        <SelectValue placeholder="Select smoking status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="non_smoker">Non-smoker</SelectItem>
                        <SelectItem value="former_smoker">
                          Former smoker
                        </SelectItem>
                        <SelectItem value="current_smoker">
                          Current smoker
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Pregnancy Status</Label>
                <Controller
                  name="pregnancyStatus"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Breastfeeding Status</Label>
                <Controller
                  name="breastfeedingStatus"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Digestive Issues</Label>
                <Controller
                  name="digestiveIssues"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      {[
                        "Bloating",
                        "Constipation",
                        "Diarrhea",
                        "Acid Reflux",
                        "IBS",
                      ].map((issue) => (
                        <div
                          key={issue}
                          className="flex items-center space-x-2">
                          <Checkbox
                            id={issue}
                            checked={field.value.includes(issue)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, issue]);
                              } else {
                                field.onChange(
                                  field.value.filter((i) => i !== issue)
                                );
                              }
                            }}
                          />
                          <label htmlFor={issue}>{issue}</label>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cookingSkills">Cooking Skills</Label>
                <Controller
                  name="cookingSkills"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <SelectTrigger className="bg-white/10 text-white">
                        <SelectValue placeholder="Select cooking skills" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mealPrepTime">Meal Preparation Time</Label>
                <Controller
                  name="mealPrepTime"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <SelectTrigger className="bg-white/10 text-white">
                        <SelectValue placeholder="Select meal prep time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="extensive">Extensive</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budgetConstraints">Budget Constraints</Label>
                <Controller
                  name="budgetConstraints"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <SelectTrigger className="bg-white/10 text-white">
                        <SelectValue placeholder="Select budget constraints" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Food Preferences</Label>
                <Controller
                  name="foodPreferences"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      {["Spicy", "Sweet", "Savory", "Bitter", "Sour"].map(
                        (preference) => (
                          <div
                            key={preference}
                            className="flex items-center space-x-2">
                            <Checkbox
                              id={preference}
                              checked={field.value.includes(preference)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, preference]);
                                } else {
                                  field.onChange(
                                    field.value.filter((p) => p !== preference)
                                  );
                                }
                              }}
                            />
                            <label htmlFor={preference}>{preference}</label>
                          </div>
                        )
                      )}
                    </div>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
                Begin Your Transformation
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NutritionistShowcase;
