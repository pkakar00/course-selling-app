import {
  Popover,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { indigo } from "@mui/material/colors";
import { userData as ud, popoverStatus, role } from "../states/loginAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect } from "react";
const baseUrl = import.meta.env.VITE_BASE_URL as string;

export default function PopoverCard({
  avatarRef,
  togglePopover,
}: {
  avatarRef: React.MutableRefObject<null>;
  togglePopover: () => void;
}) {
  const popStatus = useRecoilValue(popoverStatus);
  const [userData, setUserData] = useRecoilState(ud);
  const userRole = useRecoilValue(role);

  useEffect(() => {
    (async () => {
      if (popStatus) {
        console.log("Inside pop");

        if (
          userData.email === "" ||
          userData.firstName === "" ||
          userData.lastName === "" ||
          userData.username === ""
        ) {
          try {
            const fetchUserData = await fetch(
              `${baseUrl}/${userRole}/userdata`,
              {
                method: "GET",
                headers: {
                  authorization: "Bearer " + localStorage.getItem("token"),
                },
              }
            );

            const data = await fetchUserData.json();
            console.log("Data");
            console.log(data);

            setUserData(data);
          } catch (e) {
            setUserData({
              username: "Error",
              firstName: "Error",
              lastName: "Error",
              email: "Error",
            });
          }
        }
      }
    })();
  }, [popStatus]);

  return (
    <Popover
      open={popStatus}
      onClose={togglePopover}
      anchorEl={avatarRef.current}
      anchorOrigin={{
        vertical: 150,
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
    >
      <Paper
        sx={{
          width: "20vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "1.5vh",
        }}
        elevation={3}
        variant="outlined"
      >
        <Avatar
          sx={{
            bgcolor: indigo[600],
            fontSize: "2vh",
            height: "7vh",
            width: "7vh",
          }}
        >
          {userData.firstName !== "" ? userData.firstName.substring(0,1).toUpperCase() : "E"}
        </Avatar>
        <ListItemText
          sx={{ textAlign: "center", }}
          primary={userData.firstName !== "" && userData.lastName !== "" ? <h2>{userData.firstName +" "+userData.lastName}</h2> : "loading"}
        />
        <div style={{ width: "inherit" }}>
          <List
            sx={{
              width: "inherit",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <ListItem>
              <ListItemText>Role : </ListItemText>
              <ListItemText
                sx={{ textAlign: "right" }}
                primary={userData.email !== "" ? userRole : "loading"}
              />
            </ListItem>
            <ListItem>
              <ListItemText>Email : </ListItemText>
              <ListItemText
                sx={{ textAlign: "right" }}
                primary={userData.email !== "" ? userData.email : "loading"}
              />
            </ListItem>
            <ListItem>
              <ListItemText>Username : </ListItemText>
              <ListItemText
                sx={{ textAlign: "right" }}
                primary={
                  userData.username !== "" ? userData.username : "loading"
                }
              />
            </ListItem>
          </List>
        </div>
      </Paper>
    </Popover>
  );
}
