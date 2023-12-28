import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Rating,
  Typography,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
const baseUrl = import.meta.env.VITE_BASE_URL as string;
export default function DisplayCourse() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>();
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const request = await fetch(`${baseUrl}/course/${id}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (request.status === 200) {
        setCourse(await request.json());
      } else setCourse(null);
    })();
  }, []);
  if (course === null) {
    return (
      <>
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: "600",
            fontSize: "5vh",
          }}
        >
          Course Id invalid
        </Typography>
      </>
    );
  } else if (course === undefined) {
    return (
      <>
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: "600",
            fontSize: "5vh",
          }}
        >
          Loading
        </Typography>
      </>
    );
  } else
    return (
      <>
        <div
          style={{
            backgroundColor: "#2D2F31",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div
            style={{
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              margin: "5vw 10vw",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "300%",
                fontWeight: "400",
              }}
              className="courseName"
            >
              {course.courseName}
            </Typography>
            <div
              style={{ fontSize: "120%", fontFamily: "Poppins, sans-serif" }}
              className="courseSmallDescription"
            >
              {course.courseSmallDescription}
            </div>
            <div
              style={{
                fontSize: "110%",
                paddingTop: "1vh",
                fontFamily: "Poppins, sans-serif",
              }}
              className="teacherName"
            >
              Created by :{" "}
              <span style={{ color: "red" }}>{course.teacherName}</span>
            </div>
            <div
              style={{
                fontSize: "110%",
                paddingTop: "1vh",
                display: "flex",
                fontFamily: "Poppins, sans-serif",
              }}
              className="rating"
            >
              Overall rating :{" "}
              <Rating
                precision={0.5}
                name={"rating"}
                value={course.rating}
                readOnly
              />
              <pre
                style={{ fontFamily: "Poppins, sans-serif", fontSize: "90%" }}
              >{`  (${course.numberOfStudents}) students enrolled`}</pre>
            </div>
            <div
              style={{
                fontSize: "130%",
                paddingTop: "1vh",
                display: "flex",
                alignItems: "center",
              }}
              className="languages"
            >
              <LanguageIcon />
              <pre
                style={{ fontFamily: "Poppins, sans-serif", fontSize: "90%" }}
              >
                {" "}
                {course.audioLanguages.map((v, i, a) => {
                  return <>{v + (i !== a.length - 1 ? ", " : "")}</>;
                })}
                {"   "}
              </pre>

              <SubtitlesIcon />
              <pre
                style={{ fontFamily: "Poppins, sans-serif", fontSize: "90%" }}
              >
                {" "}
                {course.subtitleLanguages.map((v, i, a) => {
                  return <>{v + (i !== a.length - 1 ? ", " : "")}</>;
                })}
              </pre>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          className="main"
        >
          <div
            style={{
              border: "1px solid black",
              marginTop: "2vh",
              padding: "3vh",
              width: "40vw",
              borderRadius: "20px",
            }}
            className="objectives"
          >
            <Typography
              sx={{
                fontSize: "4vh",
                fontWeight: "bold",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              What you will learn
            </Typography>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1vh",
                fontSize: "130%",
                width: "inherit",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {course.objectives.map((v, i) => {
                return <li key={i}>{v}</li>;
              })}
            </ul>
          </div>

          <div
            style={{
              border: "1px solid black",
              marginTop: "2vh",
              padding: "3vh",
              width: "40vw",
              fontFamily: "Poppins, sans-serif",
              borderRadius: "20px",
            }}
            className="requirements"
          >
            <Typography
              sx={{
                fontSize: "4vh",
                fontWeight: "bold",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Requirements
            </Typography>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1vh",
                fontSize: "130%",
                width: "inherit",
              }}
            >
              {course.requirements.map((v, i) => {
                return <li key={i}>{v}</li>;
              })}
            </ul>
          </div>

          <div
            style={{
              border: "1px solid black",
              marginTop: "2vh",
              padding: "3vh",
              width: "40vw",
              borderRadius: "20px",
            }}
            className="description"
          >
            <Typography
              sx={{
                fontSize: "4vh",
                fontWeight: "bold",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Description
            </Typography>
            <pre
              style={{
                fontSize: "130%",
                fontFamily: "Poppins, sans-serif",
                whiteSpace: "pre-wrap",
              }}
            >
              {course.description}
            </pre>
          </div>
          <div
            style={{
              border: "1px solid black",
              marginTop: "2vh",
              padding: "3vh",
              width: "40vw",
              borderRadius: "20px",
            }}
            className="videos"
          >
            <Typography
              sx={{
                fontSize: "4vh",
                fontWeight: "bold",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Videos
            </Typography>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1vh",
                fontSize: "130%",
                width: "inherit",
              }}
            >
              {course.videos.map((v, i) => {
                return (
                  <ListItemButton onClick={()=>{navigate(`${v.videoLink}`)}} key={i} component="a" href="#simple-list">
                    <ListItemAvatar>
                      <OndemandVideoIcon />
                    </ListItemAvatar>
                    <ListItemText>
                      <div
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "2.3vh",
                          fontWeight: "300",
                        }}
                      >
                        {v.videoName}
                      </div>
                    </ListItemText>
                  </ListItemButton>
                );
              })}
            </ul>
          </div>
        </div>
      </>
    );
}