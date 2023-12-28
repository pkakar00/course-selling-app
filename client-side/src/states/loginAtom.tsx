import { atom } from "recoil";
export const loggedIn = atom({ key: "loggedIn", default: false });
export const navBarLoading = atom({ key: "navBarLoading", default: false });
export const userData = atom({
  key: "userData",
  default: { username: "", email: "", firstName: "", lastName: "" },
});
export const popoverStatus = atom({ key: "popoverStatus", default: false });
export const role = atom({
  key: "role",
  default: sessionStorage.getItem("role") || "global",
});
