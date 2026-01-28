import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Box, AppBar, Toolbar, IconButton, Typography, Paper } from "@mui/material";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Box display="flex" minHeight="100vh" bgcolor="grey.100">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <Box flex="1" display="flex" flexDirection="column" minWidth={0}>
        {/* Top Bar */}
        <AppBar position="static" color="inherit" elevation={1}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setIsSidebarOpen(true)}
              sx={{ display: { lg: "none" }, mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              sx={{ flexGrow: 1, color: "text.primary", textOverflow: "ellipsis" }}
            >
              Admin Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box flex="1" p={{ xs: 2, md: 3 }} overflow="auto">
          <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, boxShadow: 1 }}>
            <Outlet />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
