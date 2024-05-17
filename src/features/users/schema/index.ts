import { z } from "zod";

export const ProfileSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  gender: z.enum(["Male", "Female"]),
});

export const accountSetupSchema = z
  .object({
    name: z.string(),
    username: z.string(),
    bio: z.string().optional(),
    email: z.string().email(),
    phoneNumber: z.string(),
    gender: z.enum(["Male", "Female"]),
    avatarUrl: z.string(),
    userType: z.enum(["Student", "Instructor"]),
    experience: z.number({ coerce: true }).optional(),
    areasOfInterest: z
      .array(z.string().uuid({ message: "Invalid area of interest" }))
      .optional()
      .default([]),
    specialities: z
      .array(z.string().uuid({ message: "Invalid area of specialities" }))
      .optional()
      .default([]),
    skillLevel: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
    instagram: z.string().url().optional(),
    facebook: z.string().url().optional(),
    twitter: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    youtube: z.string().url().optional(),
    tiktok: z.string().url().optional(),
  })
  .refine((data) => !(data.userType == "Instructor" && !data.specialities), {
    message: "Specialities required",
    path: ["specialities"],
  })
  .refine(
    (data) =>
      !(
        data.userType == "Instructor" &&
        (data.experience === null || data.experience == undefined)
      ),
    {
      message: "Expirience required",
      path: ["experience"],
    }
  )
  .refine(
    (data) =>
      !(
        data.userType == "Student" &&
        (data.skillLevel === null || data.skillLevel == undefined)
      ),
    {
      message: "Current skill level required",
      path: ["skillLevel"],
    }
  )
  .refine((data) => !(data.userType == "Student" && !data.areasOfInterest), {
    message: "Areas of interest required",
    path: ["areasOfInterest"],
  });
