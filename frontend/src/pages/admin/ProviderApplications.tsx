import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchApplications,
  approveApplication,
  rejectApplication,
} from "../../features/admin/adminThunk";
import { CheckCircle, XCircle } from "lucide-react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const statusColors: Record<string, { bg: string; text: string }> = {
  Pending: { bg: "#FEF3C7", text: "#B45309" }, // Yellow
  Approved: { bg: "#DCFCE7", text: "#166534" }, // Green
  Rejected: { bg: "#FEE2E2", text: "#991B1B" }, // Red
};

const ProviderApplications = () => {
  const dispatch = useAppDispatch();
  const { applications, loading } = useAppSelector((s: any) => s.admin);

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  const handleApprove = async (id: string) => {
    await dispatch(approveApplication({ id }));
    dispatch(fetchApplications());
  };

  const handleReject = async (id: string) => {
    await dispatch(rejectApplication({ id }));
    dispatch(fetchApplications());
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <Typography color="text.secondary">Loading applications...</Typography>
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
          Provider Applications
        </Typography>
        <Chip
          label={`Total: ${applications?.length || 0}`}
          sx={{ backgroundColor: "grey.100" }}
          size="small"
        />
      </Box>

      {/* Empty State */}
      {!applications || applications.length === 0 ? (
        <Paper
          sx={{
            textAlign: "center",
            py: 8,
            backgroundColor: "background.paper",
          }}
        >
          <Typography color="text.secondary">
            No provider applications found
          </Typography>
        </Paper>
      ) : (
        <Box display="flex" flexDirection="column" gap={3}>
          {applications.map((app: any) => (
            <Paper
              key={app._id}
              sx={{
                p: isMobile ? 2 : 3,
                backgroundColor: "background.paper",
                borderRadius: 2,
                boxShadow: 1,
                transition: "0.3s",
                "&:hover": { boxShadow: 3 },
              }}
            >
              {/* Header */}
              <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                <Box minWidth={0}>
                  <Typography
                    fontWeight={600}
                    variant={isMobile ? "body1" : "h6"}
                    noWrap
                  >
                    {app.user?.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {app.user?.email}
                  </Typography>
                </Box>

                <Chip
                  label={app.status}
                  size="small"
                  sx={{
                    bgcolor: statusColors[app.status]?.bg,
                    color: statusColors[app.status]?.text,
                    fontWeight: 600,
                  }}
                />
              </Box>

              {/* Details */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  backgroundColor: "grey.50",
                  borderRadius: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Typography variant="body2">
                  <strong>Business:</strong> {app.businessName}
                </Typography>
                <Typography variant="body2">
                  <strong>Applied On:</strong>{" "}
                  {new Date(app.appliedAt).toLocaleDateString()}
                </Typography>
                {app.adminRemark && (
                  <Typography variant="body2" fontStyle="italic" color="text.secondary">
                    <strong style={{ fontStyle: "normal" }}>Admin Remark:</strong>{" "}
                    {app.adminRemark}
                  </Typography>
                )}
              </Paper>

              {/* Documents */}
              {app.kycDocuments?.length > 0 && (
                <Box mt={3}>
                  <Typography variant="subtitle2" fontWeight={600} mb={1}>
                    Documents
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={2}>
                    {app.kycDocuments.map((doc: any, index: number) => (
                      <Paper
                        key={index}
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "grey.300",
                          width: isMobile ? "100%" : 200,
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="caption" fontWeight={600}>
                            {doc.type}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {doc.documentNumber}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            position: "relative",
                            overflow: "hidden",
                            borderRadius: 1,
                            bgcolor: "grey.100",
                            cursor: "pointer",
                          }}
                        >
                          <img
                            src={doc.documentImage}
                            alt={doc.type}
                            style={{
                              width: "100%",
                              height: 150,
                              objectFit: "contain",
                              transition: "transform 0.3s",
                            }}
                            onClick={() => window.open(doc.documentImage, "_blank")}
                            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                          />
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Actions */}
              {app.status === "Pending" && (
                <Box
                  display="flex"
                  flexDirection={isMobile ? "column" : "row"}
                  gap={2}
                  mt={3}
                >
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={() => handleApprove(app._id)}
                    fullWidth={isMobile}
                  >
                    Approve Application
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<XCircle />}
                    onClick={() => handleReject(app._id)}
                    fullWidth={isMobile}
                  >
                    Reject Application
                  </Button>
                </Box>
              )}
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ProviderApplications;
