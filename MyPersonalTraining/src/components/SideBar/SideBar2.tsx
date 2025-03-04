import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import "./SideBar.css";
type BreakPoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "always" | "all";

const BREAK_POINTS = {
  xs: "480px",
  sm: "576px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
  xxl: "1600px",
  always: "always",
  all: "all",
};

export default function SideBar2() {
  const dataUser = sessionStorage.getItem("user");
  const user = dataUser ? JSON.parse(dataUser) : null;
  return (
    <>
      <Sidebar>
        <Menu
          menuItemStyles={{
            button: {
              // the active class will be added automatically by react router
              // so we can use it to style the active menu item
              [`&.active`]: {
                backgroundColor: "#13395e",
                color: "#b6c8d9",
              },
            },
          }}
        >
          <div className="sidebar-header">
            {user.Name} {user.Surname}
            <br></br>
            <div className="sidebar-subheader">{user.UserType}</div>
          </div>
          <MenuItem component={<Link to="/documentation" />}>
            {" "}
            Documentation
          </MenuItem>
          <MenuItem component={<Link to="/calendar" />}> Calendar</MenuItem>
          <MenuItem component={<Link to="/e-commerce" />}> E-commerce</MenuItem>
        </Menu>
      </Sidebar>
    </>
  );
}
