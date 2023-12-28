import { useEffect, useState, useCallback } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Button, Card, Rating, Typography } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
const baseUrl = import.meta.env.VITE_BASE_URL as string;

export default function UserCourses() {
  const [result, setResult] = useState<user | undefined | null>(undefined);
  const [status, setStatus] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    async function getData() {
      const token = localStorage.getItem("token");

      const getCourses = await fetch(`${baseUrl}/user/my-courses`, {
        method: "GET",
        headers: {
          authorization: "Bearer " + token,
          "Content-type": "application/json",
        },
      });

      setStatus(getCourses.status);

      if (getCourses.status === 200) {
        const response = await getCourses.json();
        const responseObj: user = response;
        setResult(responseObj);
      }
      if (getCourses.status === 500) {
        setResult(null);
      }
    }
    getData();
  }, []);

  const goToCourse = useCallback((id: number) => {
    navigate(`/user/course/${id}`);
  }, []);

  if (status === 403) {
    return (
      <div style={{ display: "flex", flexDirection: "row", gap: "1vw" }}>
        <Typography
          sx={{ fontFamily: "Poppins, sans-serif", fontSize: "1.5vw" }}
        >
          Access forbidden,{" "}
        </Typography>
        <Link
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "1.5vw" }}
          to={"/user/login"}
        >
          Log in
        </Link>
      </div>
    );
  }
  if (status === 500) {
    return (
      <>
        <Typography
          sx={{ fontFamily: "Poppins, sans-serif", fontSize: "2.5vw" }}
        >
          Server Error,
        </Typography>
      </>
    );
  }
  return (
    <>
      {result && result.purchasedCourses && result.purchasedCourses.length ? (
        <>
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
                Your Courses
              </Typography>
            </div>

            <Grid
              sx={{ justifyContent: "center", padding: "2vh 15vw" }}
              container
              gap={5}
            >
              {result.purchasedCourses.map((x, index) => (
                <Grid key={index} xl={2.5} lg={3.5} md={5.5} sm={12}>
                  <Card
                    sx={{
                      padding: "1vh",
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "#FFFFFF",
                    }}
                    onClick={() => {
                      goToCourse(x._id);
                    }}
                  >
                    <img
                      src={x.courseImageLink}
                      alt="Course Image"
                      height={"170vw"}
                      width={"170vw"}
                      style={{ alignSelf: "center" }}
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
                    <Button
                      variant="contained"
                      onClick={() => {
                        navigate(`/user/course/${x._id}`);
                      }}
                    >
                      View
                    </Button>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        </>
      ) : (
        <Typography
          sx={{ fontFamily: "Poppins, sans-serif", fontSize: "1.5vw" }}
        >
          No Courses available, You can buy courses{" "}
          <Link to={"/global/all-courses"}>here</Link>
        </Typography>
      )}
    </>
  );
}