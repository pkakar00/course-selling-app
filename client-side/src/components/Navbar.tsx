import { Avatar, Button, ButtonGroup } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import logo from "../logo2.png";
import { useRecoilState, useSetRecoilState } from "recoil";
import { loggedIn, popoverStatus, role, userData } from "../states/loginAtom";
import { indigo } from "@mui/material/colors";
import { useCallback, useRef } from "react";
import PopoverCard from "./PopoverCard";
export default function Navbar() {
  const navigate = useNavigate();
  const [login, setLogin] = useRecoilState(loggedIn);
  const avatarRef = useRef(null);
  const setPopoverStatus = useSetRecoilState(popoverStatus);
  const setUserData = useSetRecoilState(userData);
  const togglePopover = useCallback(() => {
    setPopoverStatus((x) => !x);
  }, []);
  const [userRole,setUserRole]=useRecoilState(role);
  
  return (
    <>
      <div
        style={{
          display: "flex",
          height: "6.5vh",
          padding: "0.8vh",
          marginBottom: "0vh",
          boxShadow: "0 2px 4px rgba(0,0,0,.08),0 4px 12px rgba(0,0,0,.08)",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor:"#FFFFFF"
        }}
        className="navBar"
      >
        <div style={{ display: "flex", flexDirection: "row", gap: "1vw" }}>
          <img
            style={{ borderRadius: "10px", width: "15vw" }}
            src={logo}
            alt=""
          />
          <div style={{ display: "flex", flexDirection: "row", gap: "0.2vw" }}>
            <Button
              onClick={() => {
                navigate("/global/all-courses");
              }}
              style={{ color: "black" }}
              variant="text"
              sx={{ fontFamily: "Poppins, sans-serif", color:"#EDDBC7" }}
            >
              All Courses
            </Button>
            {(userRole==="user" || userRole==="global") && <Button
              onClick={() => {
                navigate("/user/my-courses");
              }}
              style={{ color: "black" }}
              variant="text"
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              My Courses
            </Button>}
            {userRole==="admin" && <Button
              onClick={() => {
                navigate("/admin/new-course");
              }}
              style={{ color: "black" }}
              variant="text"
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              Add course
            </Button>}
          </div>
        </div>

        <div className="searchBar">
          <input
            placeholder="Search for Courses"
            className="searchBox"
            type="text"
            style={{fontFamily: "Poppins, sans-serif",}}
          />
          <SearchIcon fontSize="large" />
        </div>
        <ButtonGroup
          sx={{ height: "5vh" }}
          variant="text"
          aria-label="outlined primary button group"
        >
          {!login && (
            <Button
              onClick={() => {
                navigate(`/user/login`);
              }}
              sx={{ color: "black",fontFamily: "Poppins, sans-serif", }}
            >
              Login
            </Button>
          )}
          {!login && (
            <Button
              onClick={() => {
                navigate(`/user/signup`);
              }}
              sx={{ color: "black",fontFamily: "Poppins, sans-serif", }}
            >
              Signup
            </Button>
          )}
          {login && (
            <div
              style={{ display: "flex", gap: "0.5vw", alignItems: "center" }}
            >
              <Avatar
                ref={avatarRef}
                onClick={togglePopover}
                sx={{ bgcolor: indigo[600] }}
              >
                P
              </Avatar>
              <PopoverCard
                togglePopover={togglePopover}
                avatarRef={avatarRef}
              />
              <Button
                onClick={() => {
                  localStorage.removeItem("token");
                  setLogin(false);
                  setUserData({
                    username: "",
                    email: "",
                    firstName: "",
                    lastName: "",
                  });
                  setUserRole("global");
                  navigate("/");
                }}
                sx={{
                  color: "black",
                  fontSize: "1.5vh",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Signout
              </Button>
            </div>
          )}
        </ButtonGroup>
      </div>
    </>
  );
}
