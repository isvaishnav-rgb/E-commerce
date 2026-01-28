import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUsers } from "../../features/admin/adminThunk";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const Users = () => {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((s: any) => s.admin);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <Typography color="text.secondary">Loading users...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="space-between"
        alignItems={isMobile ? "flex-start" : "center"}
        gap={1}
        mb={3}
      >
        <Typography variant="h5" fontWeight={600}>
          Users
        </Typography>
        <Chip
          label={`Total: ${users.length}`}
          size="small"
          sx={{ backgroundColor: "grey.100" }}
        />
      </Box>

      {/* Mobile Card View */}
      {isMobile && (
        <Box display="flex" flexDirection="column" gap={2}>
          {users.map((u: any) => (
            <Paper key={u._id} sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Box minWidth={0}>
                  <Typography fontWeight={600} noWrap>
                    {u.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {u.email}
                  </Typography>
                </Box>
                <Chip
                  label={u.role}
                  size="small"
                  sx={{ bgcolor: "primary.100", color: "primary.700", fontWeight: 600 }}
                />
              </Box>

              <Box display="flex" flexDirection="column" gap={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body2">{u.phone || "-"}</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">
                    Joined
                  </Typography>
                  <Typography variant="body2">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">
                    Verification
                  </Typography>
                  <Chip
                    label={u.verified ? "Verified" : "Unverified"}
                    size="small"
                    sx={{
                      bgcolor: u.verified ? "success.100" : "error.100",
                      color: u.verified ? "success.700" : "error.700",
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={u.isActive ? "Active" : "Inactive"}
                    size="small"
                    sx={{
                      bgcolor: u.isActive ? "success.100" : "grey.200",
                      color: u.isActive ? "success.700" : "text.secondary",
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Desktop Table View */}
      {!isMobile && (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {["Name", "Email", "Phone", "Role", "Verified", "Status", "Joined"].map(
                  (header) => (
                    <TableCell key={header} sx={{ fontWeight: 600 }}>
                      {header}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((u: any) => (
                <TableRow key={u._id} hover>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.phone || "-"}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.role}
                      size="small"
                      sx={{ bgcolor: "primary.100", color: "primary.700", fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={u.verified ? "Verified" : "Unverified"}
                      size="small"
                      sx={{
                        bgcolor: u.verified ? "success.100" : "error.100",
                        color: u.verified ? "success.700" : "error.700",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={u.isActive ? "Active" : "Inactive"}
                      size="small"
                      sx={{
                        bgcolor: u.isActive ? "success.100" : "grey.200",
                        color: u.isActive ? "success.700" : "text.secondary",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Empty State */}
      {users.length === 0 && (
        <Paper
          sx={{
            textAlign: "center",
            py: 8,
            backgroundColor: "background.paper",
            mt: 2,
          }}
        >
          <Typography color="text.secondary">No users found</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Users;
