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
import { useSetRecoilState } from "recoil";
import { loggedIn, navBarLoading, role } from "../states/loginAtom";
const baseUrl = import.meta.env.VITE_BASE_URL as string;

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const setLogin = useSetRecoilState(loggedIn);
  const setNavBarLoading = useSetRecoilState(navBarLoading);
  const location = useLocation();
  const userRole = location.pathname.split("/")[1];
  const setRoleState = useSetRecoilState(role);

  async function submitForm() {
    if (password !== confirmPassword) {
      setMessage("Passwords Do not match");
      return;
    }
    const signupUser = await fetch(`${baseUrl}/${userRole}/signup`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ username, password, email, firstName, lastName }),
    });
    const response = await signupUser.json();
    if (signupUser.status === 201) {
      localStorage.setItem("token", response.token);
      setLogin(true);
      setNavBarLoading(false);
      setRoleState(userRole);
      sessionStorage.setItem("role", userRole);
      userRole === "user"
        ? navigate("/user/my-courses")
        : navigate("/admin/new-course");
    } else {
      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setMessage(response.message);
    }
  }

  return (
    <>
      <div style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", height:"90vh"}}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
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
              height: "auto",
              fontFamily: "Poppins, sans-serif",
            }}
            variant="outlined"
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{ fontFamily: "Poppins, sans-serif", fontSize: "1.7vw" }}
              >
                Signup
              </Typography>
            </div>
            {message.length > 0 && <Alert severity="error">{message}</Alert>}
            <TextField
              variant="outlined"
              label="First name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              className={"MuiTextField-root"}
            />
            <TextField
              variant="outlined"
              label="Last name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
            <TextField
              variant="outlined"
              label="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <TextField
              variant="outlined"
              label="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <TextField
              variant="outlined"
              label="Password"
              value={password}
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <TextField
              variant="outlined"
              label="Confirm Password"
              value={confirmPassword}
              type="password"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
            <br />
            Already registered? ...
            <Link href={`http://ec2-3-15-172-164.us-east-2.compute.amazonaws.com/${userRole}/login`}>
              Login Here
            </Link>
            <Button color="success" variant="contained" onClick={submitForm}>
              Signup
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
}
