import { z } from "zod";

export const topicValidationSchema = z.object({
  name: z.string().max(191).min(1, "Topic name required"),
  overview: z.string().optional(),
  thumbnail: z.string().min(1, "Required"),
});

export const courseValidationSchema = z.object({
  title: z.string().min(1, "Title required"),
  overview: z.string().min(1, "Title required"),
  language: z.enum(["English", "Swahili"]),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  status: z.enum(["Draft", "Published"]),
  price: z.number({ coerce: true }),
  timeToComplete: z.number({ coerce: true }),
  previewVideo: z.string().min(1, "Preview video required"),
  previewVideoSource: z.enum(["file", "network", "youtube"]),
  thumbnail: z.string().min(1, "Thumbnail required"),
  topics: z.array(z.string().uuid("Invalid topic")),
  tags: z.string(),
});

export const moduleValidationSchema = z.object({
  title: z.string().min(1, "Title required"),
  overview: z.string().min(10, "Overview too short").optional(),
  order: z.number({ coerce: true }).min(-1).optional().default(-1),
});
