var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User, Admin, Course } from "../db/serverDatabase.js";
import { authenticateAdmin } from "../middlewares/auth.js";
import { loginSchema, signupSchema, courseSchema } from "@pulkitkakar7/common";
dotenv.config();
export const app = Router();
const ADMIN_SECRET = process.env.ADMIN_SECRET;
app.get("/isLoggedIn", authenticateAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({ message: "User logged in" });
}));
app.get("/userdata", authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield Admin.findOne({ username: res.locals.user.username });
        if (user) {
            res.status(200).json({
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            });
        }
        else {
            next(new Error("Admin not found"));
        }
    }
    catch (error) {
        next(error);
    }
}));
app.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = loginSchema.safeParse(req.body);
        if (result.success) {
            const { username, password } = result.data;
            const user = yield Admin.findOne({ username, password });
            console.log(user);
            if (user) {
                console.log("User");
                const token = jwt.sign({ username, password }, ADMIN_SECRET, {
                    expiresIn: "1h",
                });
                res.status(200).json(token);
            }
            else {
                res
                    .status(403)
                    .json({ message: "Invalid username or password" });
            }
        }
        else
            res.status(411).json({ message: result.error.issues[0].message });
    }
    catch (error) {
        next(error);
    }
}));
app.post("/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = signupSchema.safeParse(req.body);
        if (result.success) {
            const { username, password, email, firstName, lastName } = result.data;
            let checkDb = yield Admin.findOne({ username });
            if (checkDb) {
                res.status(409).json({ message: "username already used" });
                return;
            }
            checkDb = yield Admin.findOne({ email });
            if (checkDb) {
                res.status(409).json({ message: "email already used" });
                return;
            }
            const user = new Admin({
                username,
                password,
                email,
                firstName,
                lastName,
            });
            user.save();
            const token = jwt.sign({ username, password }, ADMIN_SECRET, {
                expiresIn: "1h",
            });
            res.status(201).json(JSON.stringify({ message: "Admin Created", token }));
        }
        else
            res.status(411).json({ message: result.error.issues[0].message });
    }
    catch (error) {
        next(error);
    }
}));
app.get("/courses", authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield Course.find();
        res.status(200).json(JSON.stringify({ courses }));
    }
    catch (error) {
        next(error);
    }
}));
app.get("/users", authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User.find();
        res.status(200).json(JSON.stringify({ users }));
    }
    catch (error) {
        next(error);
    }
}));
app.put("/edit-course/:courseId", authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = req.params.courseId;
        const courseExists = yield Course.findOne({ _id: courseId });
        console.log(courseExists);
        if (!courseExists)
            res
                .status(400)
                .json(JSON.stringify({ message: "Course Does not exist" }));
        else {
            const result = courseSchema.safeParse(req.body);
            if (result.success) {
                const { courseName, teacherName, tags, courseSmallDescription, numberOfStudents, audioLanguages, subtitleLanguages, objectives, requirements, description, rating, courseImageLink, videos, price, } = result.data;
                yield Course.updateOne({ _id: courseId }, {
                    courseName,
                    teacherName,
                    tags,
                    courseSmallDescription,
                    numberOfStudents,
                    audioLanguages,
                    subtitleLanguages,
                    objectives,
                    requirements,
                    description,
                    rating,
                    courseImageLink,
                    videos,
                    price,
                });
                res.status(200).json({ message: "Course updated" });
            }
            else
                res.status(411).json({ message: result.error.issues[0].message });
        }
    }
    catch (e) {
        next(e);
    }
}));
app.post("/new-course", authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Hello here in new cc");
    try {
        const result = courseSchema.safeParse(req.body);
        if (!result.success) {
            res.status(411).json({ message: result.error.issues[0].message });
            return;
        }
        const { courseName, teacherName, tags, courseSmallDescription, numberOfStudents, audioLanguages, subtitleLanguages, objectives, requirements, description, rating, courseImageLink, videos, price, } = result.data;
        const doesExist = yield Course.findOne({ courseName });
        console.log(doesExist);
        if (doesExist) {
            res
                .status(400)
                .json(JSON.stringify({ message: "Course already exists" }));
            return;
        }
        else {
            yield new Course({
                courseName,
                teacherName,
                tags,
                courseSmallDescription,
                numberOfStudents,
                audioLanguages,
                subtitleLanguages,
                objectives,
                requirements,
                description,
                rating,
                courseImageLink,
                videos,
                price,
            }).save();
            res.status(200).json({ message: "Course Created" });
        }
    }
    catch (e) {
        next(e);
    }
}));
app.put("/edit-user/:userId", authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const doesExist = yield User.findOne({ _id: userId });
        console.log(doesExist);
        if (!doesExist)
            res.status(400).json(JSON.stringify({ message: "User Does not exist" }));
        else {
            const result = signupSchema.safeParse(req.body);
            if (!result.success) {
                res.status(411).json({ message: result.error.issues[0].message });
                return;
            }
            const { username, password, email } = result.data;
            yield User.updateOne({ _id: userId }, { username, password, email });
            res.status(200).json({ message: "User Updated" });
        }
    }
    catch (e) {
        next(e);
    }
}));
app.get("/course/:courseId", authenticateAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.courseId;
        const course = yield Course.findById(id);
        if (course)
            res.status(200).json(course);
        else
            res.status(400).json({ message: "Course Does not exist" });
    }
    catch (error) {
        next(error);
    }
}));
app.use((err, req, res, next) => {
    console.log(err);
    res
        .send(500)
        .json({ message: "Something went wrong in the server or database" });
});
