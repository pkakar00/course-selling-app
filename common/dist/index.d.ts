import { z } from "zod";
export declare const loginSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
export declare const signupSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodEffects<z.ZodString, string, string>;
    email: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
}, {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
}>;
export declare const courseSchema: z.ZodObject<{
    courseName: z.ZodString;
    teacherName: z.ZodString;
    tags: z.ZodArray<z.ZodString, "many">;
    courseSmallDescription: z.ZodString;
    numberOfStudents: z.ZodNumber;
    audioLanguages: z.ZodArray<z.ZodString, "many">;
    subtitleLanguages: z.ZodArray<z.ZodString, "many">;
    objectives: z.ZodArray<z.ZodString, "many">;
    requirements: z.ZodArray<z.ZodString, "many">;
    description: z.ZodString;
    rating: z.ZodNumber;
    courseImageLink: z.ZodString;
    price: z.ZodNumber;
    videos: z.ZodArray<z.ZodObject<{
        videoName: z.ZodString;
        videoLink: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        videoName: string;
        videoLink: string;
    }, {
        videoName: string;
        videoLink: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    courseName: string;
    teacherName: string;
    tags: string[];
    courseSmallDescription: string;
    numberOfStudents: number;
    audioLanguages: string[];
    subtitleLanguages: string[];
    objectives: string[];
    requirements: string[];
    description: string;
    rating: number;
    courseImageLink: string;
    price: number;
    videos: {
        videoName: string;
        videoLink: string;
    }[];
}, {
    courseName: string;
    teacherName: string;
    tags: string[];
    courseSmallDescription: string;
    numberOfStudents: number;
    audioLanguages: string[];
    subtitleLanguages: string[];
    objectives: string[];
    requirements: string[];
    description: string;
    rating: number;
    courseImageLink: string;
    price: number;
    videos: {
        videoName: string;
        videoLink: string;
    }[];
}>;
export type LoginParams = z.infer<typeof loginSchema>;
export type SignupParams = z.infer<typeof signupSchema>;
export type CourseParams = z.infer<typeof courseSchema>;
