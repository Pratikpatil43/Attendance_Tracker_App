import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  IconButton,
  useMediaQuery,
  Divider,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Add,
  List as ListIcon,
  Menu as MenuIcon,
  AccountCircle,
  Logout,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const drawerWidth = 240;
  const [open, setOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    // Check if the user is logged in by validating the presence of a token
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setOpen(false);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.clear(); // Clear session storage
    setIsLoggedIn(false); // Update state to reflect logged-out status
    navigate("/login"); // Redirect to login page
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Mobile Menu Icon */}
      {isMobile && (
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 1201,
          }}
          onClick={toggleDrawer}
        >
          <MenuIcon sx={{ fontSize: "2rem" }} />
        </IconButton>
      )}

      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
          },
        }}
        variant={isMobile ? "temporary" : "permanent"}
        anchor="left"
        open={open}
        onClose={toggleDrawer}
      >
        <Toolbar />
        <Box
          sx={{
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Section: Faculty */}
          <List dense>
            <ListItem
              button
              component={Link}
              to="/dashboard/add-faculty"
              onClick={handleLinkClick}
            >
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary="Add Faculty" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/dashboard/fetch-faculty"
              onClick={handleLinkClick}
            >
              <ListItemIcon>
                <ListIcon />
              </ListItemIcon>
              <ListItemText primary="Fetch-faculty" />
            </ListItem>
          </List>
        </Box>

        {/* More Options Section */}
        <Divider />
        <Box sx={{ padding: "10px" }}>
          <Button
            fullWidth
            variant="contained"
            sx={{ backgroundColor: "#1976d2", color: "#fff" }}
            startIcon={<AccountCircle />}
            onClick={handleMenuOpen}
          >
            More Options
          </Button>
          <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
            <MenuItem onClick={() => navigate("/profile")}>My Profile</MenuItem>
          </Menu>
        </Box>

        {/* Conditional Logout Button */}
        <Box sx={{ padding: "10px", marginTop: "auto" }}>
          {isLoggedIn && (
            <Button
              fullWidth
              variant="contained"
              color="error"
              startIcon={<Logout />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
