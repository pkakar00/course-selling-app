import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course", unique: true }],
});
const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
});
const coursesSchema = new mongoose.Schema({
    courseName: { type: String, required: true, unique: true },
    teacherName: { type: String, require: true },
    tags: [String],
});
export const User = mongoose.model("User", userSchema);
export const Admin = mongoose.model("Admin", adminSchema);
export const Course = mongoose.model("Course", coursesSchema);
