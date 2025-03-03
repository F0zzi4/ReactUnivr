import {
  Drawer,
  List,
  ListItemText,
  Divider,
  Toolbar,
  Button,
  CssBaseline,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import "./SideBar.css";

const drawerWidth = 240;

export default function SideBar() {
  const dataUser = sessionStorage.getItem("user");
  const user = dataUser ? JSON.parse(dataUser) : null;

  return (
    <>
      <CssBaseline />
      {/* Fixed Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          color: "red",
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#198E00",
          },
        }}
      >
        <Toolbar />

        {/* Navigation */}
        <List>
          <div className="sidebar-header">
            {user.Name} {user.Surname}
            <br></br>
            <div className="sidebar-subheader">{user.UserType}</div>
          </div>
          <Button
            fullWidth
            sx={{ display: "flex", alignItems: "center", padding: "8px 16px" }}
          >
            <HomeIcon sx={{ marginRight: "8px" }} />
            <ListItemText primary="Home" />
          </Button>
          <Button
            fullWidth
            sx={{ display: "flex", alignItems: "center", padding: "8px 16px" }}
          >
            <AccountCircleIcon sx={{ marginRight: "8px" }} />
            <ListItemText primary="Profilo" />
          </Button>
        </List>

        <Divider />

        {/* Settings */}
        <List>
          <Button
            fullWidth
            sx={{ display: "flex", alignItems: "center", padding: "8px 16px" }}
          >
            <SettingsIcon sx={{ marginRight: "8px" }} />
            <ListItemText primary="Impostazioni" />
          </Button>
          <Button
            fullWidth
            sx={{ display: "flex", alignItems: "center", padding: "8px 16px" }}
          >
            <InfoIcon sx={{ marginRight: "8px" }} />
            <ListItemText primary="Informazioni" />
          </Button>
        </List>
      </Drawer>
    </>
  );
}
