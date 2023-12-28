interface user {
  _id: number;
  username: string;
  password: string;
  email: string;
  purchasedCourses: Course[];
}
interface Course {
  _id: number;
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
  videos: Video[];
  courseImageLink: string;
  price:number;
}
interface Video {
  videoName: string;
  videoLink: string;
}