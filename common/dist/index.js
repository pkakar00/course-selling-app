"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseSchema = exports.signupSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(8, { message: "username must be atleast 8 characters" })
        .max(20, { message: "username must not exceed 20 characters" }),
    password: zod_1.z.string().min(8).max(16),
});
exports.signupSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(8, { message: "username must be atleast 8 characters" })
        .max(20, { message: "username must not exceed 20 characters" }),
    password: zod_1.z
        .string()
        .min(8)
        .max(16)
        .refine((x) => {
        const regex = /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~])(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/;
        return regex.test(x);
    }, {
        message: "password must contain atleast one special character, one uppercase, one lowercase letter",
    }),
    email: zod_1.z.string().email().min(8).max(25),
    firstName: zod_1.z.string().min(2).max(15),
    lastName: zod_1.z.string().min(2).max(15),
});
exports.courseSchema = zod_1.z.object({
    courseName: zod_1.z
        .string()
        .min(10, { message: "Course name must be atleast 10 characters" })
        .max(100, { message: "Course name must not exceed 100 characters" }),
    teacherName: zod_1.z
        .string()
        .min(3, { message: "Teacher name must be atleast 3 characters" })
        .max(20, { message: "Teacher name must not exceed 20 characters" }),
    tags: zod_1.z.array(zod_1.z.string()),
    courseSmallDescription: zod_1.z.string(),
    numberOfStudents: zod_1.z.number().min(0),
    audioLanguages: zod_1.z
        .array(zod_1.z.string())
        .min(1, { message: "Must specify atleast 1 audio language" }),
    subtitleLanguages: zod_1.z
        .array(zod_1.z.string())
        .min(1, { message: "Must specify atleast 1 subtitle language" }),
    objectives: zod_1.z
        .array(zod_1.z.string())
        .min(1, { message: "Must specify atleast 1 course objective" }),
    requirements: zod_1.z
        .array(zod_1.z.string())
        .min(1, { message: "Must specify atleast 1 course requirement" }),
    description: zod_1.z.string(),
    rating: zod_1.z.number().min(0).max(5),
    courseImageLink: zod_1.z.string().url(),
    price: zod_1.z.number().min(0, { message: "Price cannot be negative." }).max(999999, { message: "Price cannot exceed 999,999" }),
    videos: zod_1.z
        .array(zod_1.z.object({
        videoName: zod_1.z.string().min(5, { message: "Must specify video name" }),
        videoLink: zod_1.z.string().url({ message: "URL not correct" }),
    }))
        .min(1, { message: "Must specify atleast 1 course topic" }),
});
