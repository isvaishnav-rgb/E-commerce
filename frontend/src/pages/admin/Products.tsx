import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchProducts } from "../../features/admin/adminThunk";
import { deleteProductApi } from "../../api/admin.api";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Button,
  Chip,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const Products = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((s: any) => s.admin.products);

  const tableHeader = [
    "Product",
    "Category",
    "Price",
    "Discount",
    "FinalPrice",
    "Stock",
    "Actions",
  ];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const remove = async (id: string) => {
    await deleteProductApi(id);
    dispatch(fetchProducts());
    toast.success("Product deleted successfully");
  };

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
          Products
        </Typography>
        <Typography
          variant="body2"
          sx={{
            backgroundColor: "grey.100",
            px: 2,
            py: 0.5,
            borderRadius: 2,
          }}
        >
          Total: {products?.length}
        </Typography>
      </Box>

      {/* Mobile Card View */}
      {isMobile && (
        <Box display="flex" flexDirection="column" gap={2}>
          {products?.map((p: any) => (
            <Paper key={p._id} sx={{ p: 2 }} elevation={1}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar
                  src={p?.images?.[0]}
                  variant="rounded"
                  sx={{ width: 64, height: 64, border: "1px solid", borderColor: "grey.300" }}
                />
                <Box flex={1} minWidth={0}>
                  <Typography fontWeight={600} noWrap>
                    {p?.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    #{p?._id.slice(-6)}
                  </Typography>
                  <Typography variant="body2" color="primary.main">
                    {p?.category}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Price
                  </Typography>
                  <Typography fontWeight={500}>₹{p?.price}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Discount
                  </Typography>
                  <Typography fontWeight={500} color="success.main">
                    {p?.discount || 0}% off
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Final Price
                  </Typography>
                  <Typography fontWeight={600} color="primary.dark">
                    ₹{p?.finalPrice || p?.price}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Stock
                  </Typography>
                  <Chip
                    label={`${p?.stock} units`}
                    size="small"
                    color={p?.stock > 0 ? "success" : "error"}
                  />
                </Box>
              </Box>

              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<Trash2 size={16} />}
                onClick={() => remove(p._id)}
              >
                Delete Product
              </Button>
            </Paper>
          ))}
        </Box>
      )}

      {/* Desktop Table View */}
      {!isMobile && (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {tableHeader.map((header, idx) => (
                  <TableCell key={idx}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {products?.map((p: any) => (
                <TableRow key={p._id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        src={p?.images?.[0]}
                        variant="rounded"
                        sx={{ width: 48, height: 48, border: "1px solid", borderColor: "grey.300" }}
                      />
                      <Box>
                        <Typography fontWeight={500}>{p?.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          #{p?._id.slice(-6)}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>{p?.category}</TableCell>
                  <TableCell>₹{p?.price}</TableCell>
                  <TableCell color="success.main">{p?.discount || 0} %</TableCell>
                  <TableCell>₹{p?.finalPrice || p?.price}</TableCell>
                  <TableCell>
                    <Chip
                      label={p?.stock}
                      size="small"
                      color={p?.stock > 0 ? "success" : "error"}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="text"
                      color="error"
                      startIcon={<Trash2 size={16} />}
                      onClick={() => remove(p._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {products?.length === 0 && (
        <Paper sx={{ textAlign: "center", py: 4, mt: 2 }}>
          <Typography color="text.secondary">No products found</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Products;
