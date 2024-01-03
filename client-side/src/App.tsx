import "./App.css";
import { Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Courses from "./components/Courses";
import UserCourses from "./components/UserCourses";
import Home from "./components/Home";
import DisplayCourse from "./components/DisplayCourse";
import Navbar from "./components/Navbar";
import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { loggedIn, role } from "./states/loginAtom";
import AdminNewCourse from "./components/AdminNewCourse";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentFailed from "./components/PaymentFailed";

const baseUrl = import.meta.env.VITE_BASE_URL as string;

function App() {
  const setLogin = useSetRecoilState(loggedIn);
  const [userRole] = useRecoilState(role);
  async function callback() {
    console.log("Inside callback role=" + userRole);
    if(userRole == "global") {
      setLogin(false);
      return;
    }
    const isLoggedIn = await fetch(`${baseUrl}/${userRole}/isLoggedIn`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (isLoggedIn.status === 200) setLogin(true);
    else setLogin(false);
  }
  useEffect(() => {
    window.addEventListener("load", callback);
    return () => {
      window.removeEventListener("load", callback);
    };
  });
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/global">
          <Route path="all-courses" element={<Courses />} />
          <Route path="course/:id" element={<DisplayCourse />} />
        </Route>
        <Route path="/user">
          <Route path="login" element={<Login />} />
          <Route path="my-courses" element={<UserCourses />} />
          <Route path="signup" element={<Signup />} />
          <Route path="course/:id" element={<DisplayCourse />} />
          <Route path="payment_success" element={<PaymentSuccess />} />
          <Route path="payment_failed" element={<PaymentFailed />} />
        </Route>
        <Route path="/admin">
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="course/:id" element={<DisplayCourse />} />
          <Route
            path="edit-course/:id"
            element={<AdminNewCourse edit={true} />}
          />
          <Route path="new-course" element={<AdminNewCourse edit={false} />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
