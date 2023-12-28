import { Button, Card, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <div style={{display:"flex", flexDirection:"column",}}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "1vh",
            height:"91.6vh"
          }}
        >
          <Typography
            sx={{ fontFamily: "Poppins, sans-serif", fontSize: "4.5vw" }}
          >
            Welcome to Skilled.ca
          </Typography>
          <Button
            variant="contained"
            sx={{ width: "10vw" }}
            onClick={() => {
              navigate("/user/login");
            }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            sx={{ width: "10vw" }}
            onClick={() => {
              navigate("/user/signup");
            }}
          >
            Signup
          </Button>
        </Card>
      </div>
    </>
  );
}
