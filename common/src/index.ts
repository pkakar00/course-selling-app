import { z } from "zod";
export const loginSchema = z.object({
  username: z
    .string()
    .min(8, { message: "username must be atleast 8 characters" })
    .max(20, { message: "username must not exceed 20 characters" }),

  password: z.string().min(8).max(16),
});
export const signupSchema = z.object({
  username: z
    .string()
    .min(8, { message: "username must be atleast 8 characters" })
    .max(20, { message: "username must not exceed 20 characters" }),

  password: z
    .string()
    .min(8)
    .max(16)
    .refine(
      (x) => {
        const regex =
          /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~])(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/;
        return regex.test(x);
      },
      {
        message:
          "password must contain atleast one special character, one uppercase, one lowercase letter",
      }
    ),
  email: z.string().email().min(8).max(25),
  firstName: z.string().min(2).max(15),
  lastName: z.string().min(2).max(15),
});

export const courseSchema = z.object({
  courseName: z
    .string()
    .min(10, { message: "Course name must be atleast 10 characters" })
    .max(100, { message: "Course name must not exceed 100 characters" }),
  teacherName: z
    .string()
    .min(3, { message: "Teacher name must be atleast 3 characters" })
    .max(20, { message: "Teacher name must not exceed 20 characters" }),
  tags: z.array(z.string()),
  courseSmallDescription: z.string(), //optional
  numberOfStudents: z.number().min(0),
  audioLanguages: z
    .array(z.string())
    .min(1, { message: "Must specify atleast 1 audio language" }),
  subtitleLanguages: z
    .array(z.string())
    .min(1, { message: "Must specify atleast 1 subtitle language" }),
  objectives: z
    .array(z.string())
    .min(1, { message: "Must specify atleast 1 course objective" }),
  requirements: z
    .array(z.string())
    .min(1, { message: "Must specify atleast 1 course requirement" }),
  description: z.string(), //optional
  rating: z.number().min(0).max(5),
  courseImageLink: z.string().url(),
  price:z.number().min(0, {message:"Price cannot be negative."}).max(999999,{message:"Price cannot exceed 999,999"}),
  videos: z
    .array(
      z.object({
        videoName: z.string().min(5, { message: "Must specify video name" }),
        videoLink: z.string().url({ message: "URL not correct" }),
      })
    )
    .min(1, { message: "Must specify atleast 1 course topic" }),
});

export type LoginParams = z.infer<typeof loginSchema>;
export type SignupParams = z.infer<typeof signupSchema>;
export type CourseParams = z.infer<typeof courseSchema>;