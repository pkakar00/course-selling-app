import { IncomingHttpHeaders } from "http";
import { Double } from "mongodb";

interface IUser {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  purchasedCourses: mongoose.Types.ObjectId[];
}
interface IAdmin {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface ITopicVideo {
  videoName: string;
  videoLink: string;
}
interface ICourses {
  courseName: string;
  courseSmallDescription:string;
  numberOfStudents:number;
  audioLanguages:string[];
  subtitleLanguages:string[];
  objectives:string[];
  requirements:string[];
  description:string;
  teacherName: string;
  rating: number;
  tags: string[];
  courseImageLink: string;
  videos:ITopicVideo[];
  price:number;
}