import { Edit, Description } from "@mui/icons-material";
import { Box, Card, CardContent, Typography, Chip, Button, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";

const statusColors: any = {
  Approved: "success",
  Pending: "warning",
  Rejected: "error",
};

const ApplicationDetails = ({ application, onEdit }: any) => {
  return (
    <Box
      minHeight="100vh"
      bgcolor="background.default"
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      py={10}
      px={2}
    >
      <Card sx={{ width: "100%", maxWidth: 800, borderRadius: 3, p: 3 }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight={700}>
              Service Provider Application
            </Typography>
            <Chip
              label={application.status}
              color={statusColors[application.status]}
              sx={{ fontWeight: 600 }}
            />
          </Box>

          {/* Info */}
          <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={2}>
            <Box flex={1} bgcolor="grey.100" p={2} borderRadius={2}>
              <Typography variant="caption" color="text.secondary">
                Business Name
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {application.businessName}
              </Typography>
            </Box>

            <Box flex={1} bgcolor="grey.100" p={2} borderRadius={2}>
              <Typography variant="caption" color="text.secondary">
                Phone
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {application.businessPhone || "N/A"}
              </Typography>
            </Box>
          </Box>

          {/* Documents */}
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="subtitle1" fontWeight={600}>
              Uploaded Documents
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={2}>
              {application.kycDocuments.map((doc: any, idx: number) => (
                <MuiLink
                  key={idx}
                  href={doc.documentImage}
                  target="_blank"
                  underline="none"
                  sx={{ width: { xs: "100%", sm: "48%" } }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                    p={2}
                    borderRadius={2}
                    border={1}
                    borderColor="grey.300"
                    sx={{
                      "&:hover": { borderColor: "primary.main" },
                      transition: "all 0.2s",
                    }}
                  >
                    <Description color="primary" />
                    <Box>
                      <Typography fontWeight={600}>{doc.type}</Typography>
                      <Typography fontSize={12} color="primary.main">
                        View document
                      </Typography>
                    </Box>
                  </Box>
                </MuiLink>
              ))}
            </Box>
          </Box>

          {/* Actions */}
          {application.status === "Pending" && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Edit />}
              fullWidth
              sx={{ mt: 2 }}
              onClick={onEdit}
            >
              Edit Application
            </Button>
          )}

          {application.status === "Approved" && (
            <Button
              component={Link}
              to="/service-provider/dashboard"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Service Provider Dashboard
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ApplicationDetails;
