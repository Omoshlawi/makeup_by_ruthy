import { PHONE_NUMBER_REGEX } from "@/utils";
import { z } from "zod";

export const enrollmentValidationShema = z.object({
  phoneNumber: z.string().regex(PHONE_NUMBER_REGEX, {
    message: "Invalid phone number",
  }),
});
