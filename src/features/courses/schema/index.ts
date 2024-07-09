import { z } from "zod";

export const courseSearchSchema = z.object({
  search: z.string().optional(),
  language: z.enum(["English", "Swahili"]).optional(),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  minPrice: z.number({ coerce: true }).optional(),
  maxPrice: z.number({ coerce: true }).optional(),
  minDuration: z.number({ coerce: true }).optional(),
  maxDuration: z.number({ coerce: true }).optional(),
  page: z.number({ coerce: true }).min(1).optional().default(1),
  pageSize: z.number({ coerce: true }).min(1).optional().default(10),
});

export const courseTestQuestionValidationSChema = z.object({
  question: z.string().min(1, "Required"),
  choices: z.array(
    z.object({
      choice: z.string().min(1, "Required"),
      answer: z.boolean().optional(),
    })
  ),
});

export const courseTestValidationSchema = z.object({
  title: z.string().min(1, "Required"),
  questions: z.array(courseTestQuestionValidationSChema),
});

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

export const contentValidationSchema = z.object({
  title: z.string().min(1, "Title required"),
  type: z.enum(["Video", "Document", "Text", "Image"]),
  resource: z.string().min(1, "Required"),
  order: z.number({ coerce: true }).min(-1).optional().default(-1),
});
