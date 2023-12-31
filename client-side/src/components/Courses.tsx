import { Grid, Card, Typography, Rating, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { loggedIn, role } from "../states/loginAtom";
const baseUrl = import.meta.env.VITE_BASE_URL as string;
interface UserCourses extends Course {
  isBought: boolean;
}
export default function Courses() {
  const userRole = useRecoilValue(role);
  const [result, setResult] = useState<UserCourses[] | undefined | null>(
    undefined
  );
  const login = useRecoilValue(loggedIn);
  const navigate = useNavigate();
  
  function getText(x:UserCourses){
    if(userRole === "admin"){
      return "Edit Course";
    }
    else if(userRole === "user"){
      if(x.isBought) return "Bought";
      else return "Buy now";
    }
    else return "Buy now"; 
  }
  function editCourse(courseId:number){
    navigate(`/admin/edit-course/${courseId}`)
  }
  async function buyCourse(id: number) {
    if (!login) {
      navigate("/user/login");
      return;
    }

    const userBuyCourse = await fetch(
      `${baseUrl}/user/buy-course/${id}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (userBuyCourse && userBuyCourse.status === 303) {
      const { url }: { url: string } = await userBuyCourse.json();
      window.location.href = url;
    }
  }

  useEffect(() => {
    async function getData() {
      console.log("Login=" + login);

      if (login && userRole === "user") {
        const getAllCourses = await fetch(`${baseUrl}/courses`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        });
        const getUserCourses = await fetch(
          `${baseUrl}/user/my-courses`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        const allCoursesRes: Course[] = await getAllCourses.json();
        const userData: user = await getUserCourses.json();
        console.log(allCoursesRes);
        console.log(userData);

        if (getAllCourses.status === 200 && getUserCourses.status === 200) {
          const a = allCoursesRes.map((x) => {
            console.log("Inside mapppp");

            for (let j = 0; j < userData.purchasedCourses.length; j++) {
              console.log(userData.purchasedCourses[j]._id + " j= " + j);

              if (x._id === userData.purchasedCourses[j]._id) {
                console.log("Yes true");

                return { ...x, isBought: true };
              }
            }
            return { ...x, isBought: false };
          });
          console.log(a);

          setResult(a);
        } else setResult(null);
      } else {
        const getAllCourses = await fetch(`${baseUrl}/courses`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        });
        const r: Course[] = await getAllCourses.json();
        const response: UserCourses[] = r.map((x) => {
          return { ...x, isBought: false };
        });
        console.log(response);

        if (getAllCourses.status === 200) setResult(response);
        else setResult(null);
      }
    }
    getData();
  }, [login]);
  if (result && result.length === 0) {
    return (
      <Typography
        sx={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: "600",
          fontSize: "5vh",
        }}
      >
        No courses available
      </Typography>
    );
  }
  return (
    <>
      {result && result.length && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: "650",
                fontSize: "300%",
                padding: "2.5vw",
              }}
            >
              Courses to get you started
            </Typography>
          </div>
          <Grid
            sx={{ justifyContent: "center", padding: "2vh 15vw" }}
            container
            gap={5}
          >
            {result.map((x, index) => (
              <Grid key={index} xl={2.5} lg={3.5} md={5.5} sm={12}>
                <Card
                  sx={{
                    padding: "1vh",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#FFFFFF",
                  }}
                  onClick={() => {
                    navigate(`/global/course/${x._id}`);
                  }}
                >
                  <img
                    src={x.courseImageLink}
                    alt="Course Image"
                    height={"170vw"}
                    width={"170vw"}
                    style={{ alignSelf: "center",}}
                  />
                  <Typography
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: "600",
                      fontSize: "1.9vh",
                    }}
                  >
                    {x.courseName}
                  </Typography>
                  <Typography sx={{ fontFamily: "PT Sans, sans-serif" }}>
                    {x.teacherName}
                  </Typography>
                  <Rating value={x.rating} readOnly />
                  <br />
                  <Typography
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: "600",
                      fontSize: "1.9vh",
                    }}
                  >
                    {"CA$" + x.price}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      if(userRole === "user") buyCourse(x._id);
                      if(userRole === "admin") editCourse(x._id);
                      else navigate("/user/login");
                    }}
                    disabled={x.isBought}
                  >
                    {getText(x)}
                    
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      )}
      {result === undefined && (
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: "600",
            fontSize: "5vh",
          }}
        >
          Loading
        </Typography>
      )}
      {result === null && (
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: "600",
            fontSize: "5vh",
          }}
        >
          An error occured
        </Typography>
      )}
    </>
  );
}
