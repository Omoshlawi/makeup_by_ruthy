import { z } from "zod";

export const ProfileSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  gender: z.enum(["Male", "Female"]),
});
