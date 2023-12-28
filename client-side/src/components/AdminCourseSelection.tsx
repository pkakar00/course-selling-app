import { Grid, Card, Typography, Rating } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { loggedIn } from "../states/loginAtom";

const baseUrl = import.meta.env.VITE_BASE_URL as string;
export default function Courses() {
  const [result, setResult] = useState<Course[] | undefined>(undefined);
  const login = useRecoilValue(loggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      console.log("Login=" + login);

      if (login) {
        const getAllCourses = await fetch(baseUrl+"/courses", {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        });

        const allCoursesRes: Course[] = await getAllCourses.json();

        if (getAllCourses.status === 200) {
          setResult(allCoursesRes);
        }
        else setResult([]);
      } else {
        setResult(undefined);
        navigate('admin/login')
      }
    }
    getData();
  }, [login]);
  if (result && result.length === 0) {
    return <Typography className="">No Courses Available</Typography>;
  }
  return (
    <>
      {result && result.length && (
        <Grid sx={{ justifyContent: "center" }} container gap={5}>
          {result.map((x, index) => (
            <Grid key={index} xl={2} lg={2} md={4} sm={12}>
              <Card
                onClick={() => {
                  login
                    ? navigate(`/admin/course/${x._id}`)
                    : navigate(`/admin/login`);
                }}
              >
                <img
                  src={x.courseImageLink}
                  alt="Good Food"
                />
                <Typography>{x.courseName}</Typography>
                <Typography>{x.teacherName}</Typography>
                <Rating value={x.rating} readOnly/>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {!result && <Typography>Loading</Typography>}
    </>
  );
}