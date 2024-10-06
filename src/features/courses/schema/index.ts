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
  rating: z.number({ coerce: true }).optional(),
  includeAll: z.string().optional(),
  v: z.string().optional(),
});

export const tagSearchSchema = z.object({
  search: z.string().optional(),
  name: z.string().optional(),
  page: z.number({ coerce: true }).min(1).optional().default(1),
  pageSize: z.number({ coerce: true }).min(1).optional().default(10),
  v: z.string().optional(),
});

export const myCourseSearchSchema = z.object({
  search: z.string().optional(),
  language: z.enum(["English", "Swahili"]).optional(),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  minPrice: z.number({ coerce: true }).optional(),
  maxPrice: z.number({ coerce: true }).optional(),
  minDuration: z.number({ coerce: true }).optional(),
  maxDuration: z.number({ coerce: true }).optional(),
  page: z.number({ coerce: true }).min(1).optional().default(1),
  pageSize: z.number({ coerce: true }).min(1).optional().default(10),
  rating: z.number({ coerce: true }).optional(),
  status: z.enum(["Draft", "Published"]).optional(),
});

export const testQuestionValidationSChema = z.object({
  question: z.string().min(1, "Required"),
  choices: z
    .array(
      z.object({
        choice: z.string().min(1, "Required"),
        answer: z.boolean().optional(),
      })
    )
    .nonempty("You must provide atleast one choice")
    .refine((choices) => choices.some((choice) => choice.answer === true), {
      message: "At least one choice must be marked as the correct answer",
    }),
});

export const courseTestValidationSchema = z.object({
  title: z.string().min(1, "Required"),
  questions: z.array(testQuestionValidationSChema).optional().default([]),
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

export const attemptValidationSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().uuid("Invalid questions"),
      choices: z
        .array(z.string().uuid("Invalid choice"))
        .nonempty("You must provide atleast one choice"),
    })
  ),
});
