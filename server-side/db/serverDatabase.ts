import mongoose, { Model, Schema } from "mongoose";
import { IUser, IAdmin, ICourses } from "../types.js";
import { Double } from "mongodb";

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});
const adminSchema = new mongoose.Schema<IAdmin>({
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});
const coursesSchema = new mongoose.Schema<ICourses>({
  courseName: { type: String, required: true, unique: true },
  courseSmallDescription: { type: String },
  numberOfStudents: { type: Number, default: 0 },
  audioLanguages: [String],
  subtitleLanguages: [String],
  objectives: [String],
  requirements: [String],
  description: String,
  teacherName: { type: String, required: true },
  rating: { type: Number, default: 0.0 },
  price: { type: Number, default: 0.0 },
  videos: {
    type: [
      {
        videoName: { type: String, required: true },
        videoLink: { type: String, required: true },
      },
    ],
    required: true,
  },
  courseImageLink: { type: String, required: true },
  tags: [String],
});

export const User: Model<IUser> = mongoose.model("User", userSchema);
export const Admin: Model<IAdmin> = mongoose.model<IAdmin>(
  "Admin",
  adminSchema
);
export const Course: Model<ICourses> = mongoose.model<ICourses>(
  "Course",
  coursesSchema
);
