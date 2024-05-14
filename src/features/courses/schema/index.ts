import { z } from "zod";

export const topicValidationSchema = z.object({
  name: z.string().max(191).min(1, "Topic name required"),
  overview: z.string().optional(),
  thumbnail: z.string(),
});
