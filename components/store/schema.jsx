import * as z from "zod";

export const storeSchema = z.object({
  storeName: z.string().min(2, "Store name must be at least 2 characters"),
  storeType: z.enum(["retail", "online", "hybrid"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  website: z.string().url("Invalid URL").optional(),
  socialProfiles: z.array(z.string().url("Invalid URL")),
  logo: z.instanceof(File).optional(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  operatingHours: z.record(
    z.object({
      open: z.string(),
      close: z.string(),
    })
  ),
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms"),
});
