import {
  Alert,
  Button,
  Card,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loggedIn, navBarLoading, role } from "../states/loginAtom";
import { useSetRecoilState } from "recoil";
const baseUrl = import.meta.env.VITE_BASE_URL as string;

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const setLogin = useSetRecoilState(loggedIn);
  const setNavBarLoading = useSetRecoilState(navBarLoading);
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = location.pathname.split("/")[1];
  const setRoleState = useSetRecoilState(role);

  async function submitForm() {
    const loginUser = await fetch(`${baseUrl}/${userRole}/login`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const response = await loginUser.json();
    if (loginUser.status === 200) {
      localStorage.setItem("token", response);
      setLogin(true);
      setNavBarLoading(false);
      setRoleState(userRole);
      sessionStorage.setItem("role", userRole);
      console.log("userRole = " + userRole);

      userRole === "user"
        ? navigate("/user/my-courses")
        : navigate("/admin/new-course");
    } else {
      setPassword("");
      setUsername("");
      setMessage(response.message);
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "5vh",
          height:"90vh"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: "5vh",
          }}
        >
          <Card
            sx={{
              padding: "1vw",
              display: "flex",
              flexDirection: "column",
              gap: "2vh",
              justifyContent: "center",
              alignContent: "center",
              width: "30vw",
              fontFamily: "Poppins, sans-serif",
            }}
            variant="outlined"
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: "-2vh",
              }}
            >
              <Typography
                sx={{ fontFamily: "Poppins, sans-serif", fontSize: "1.7vw" }}
              >
                Login
              </Typography>
            </div>
            {message.length > 0 && <Alert severity="error">{message}</Alert>}
            <br />
            <TextField
              variant="outlined"
              label="Email"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            ></TextField>
            <TextField
              variant="outlined"
              label="Password"
              value={password}
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            ></TextField>
            <br />
            Not registered? ...
            <Link href={`http://ec2-3-15-172-164.us-east-2.compute.amazonaws.com/${userRole}/signup`}>
              Signup Here
            </Link>
            <Button
              variant="contained"
              color="success"
              sx={{ fontFamily: "Poppins, sans-serif" }}
              onClick={submitForm}
            >
              Login
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
}
