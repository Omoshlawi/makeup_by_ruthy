import { PHONE_NUMBER_REGEX } from "@/utils";
import { z } from "zod";

export const enrollmentValidationShema = z.object({
  phoneNumber: z.string().regex(PHONE_NUMBER_REGEX, {
    message: "Invalid phone number",
  }),
});

export const progressValidationSchema = z.object({
  module: z.string().uuid("Invalid module"),
  content: z.string().uuid("Invalid content"),
});

export const reviewValidationSchema = z.object({
  rating: z.number(),
  comment: z.string().min(1, "Invalid Comment").optional().nullable(),
});
