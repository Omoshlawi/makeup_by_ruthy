import { z } from "zod";

export const instructorSearchSchema = z.object({
  search: z.string().optional(),
  page: z.number({ coerce: true }).min(1).optional().default(1),
  pageSize: z.number({ coerce: true }).min(1).optional().default(10),
  rating: z.number({ coerce: true }).optional(),
});
