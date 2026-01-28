import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchOrders, updateOrderStatus } from "../../features/admin/adminThunk";
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";

const Orders = () => {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((s: any) => s.admin);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleStatusChange = async (orderId: string, status: string) => {
    await dispatch(updateOrderStatus({ id: orderId, status }));
    dispatch(fetchOrders());
  };

  const OrderStatus = ["Pending", "Confirmed", "Delivered", "Cancelled", "Returned"];

  if (loading) {
    return (
      <Typography variant="body1" textAlign="center" mt={4}>
        Loading orders...
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={3}>
        All Orders
      </Typography>

      {!orders || orders.length === 0 ? (
        <Typography variant="body1">No orders found</Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={3}>
          {orders.map((order: any) => (
            <Paper key={order._id} elevation={1} sx={{ p: 2 }}>
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                gap={2}
                mb={1}
              >
                <Box>
                  <Typography variant="body2">
                    <strong>Order ID:</strong>{" "}
                    <Box component="span" color="text.secondary">
                      #{order._id.slice(-6)}
                    </Box>
                  </Typography>
                  <Typography variant="body2">
                    <strong>Customer:</strong> {order.user?.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {order.user?.email}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Total:</strong>{" "}
                    <Box component="span" color="primary.main" fontWeight={500}>
                      ₹{order.totalAmount}
                    </Box>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>

                <Box width={{ xs: "100%", sm: "auto" }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={order.status}
                      label="Status"
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                    >
                      {OrderStatus.map((val, idx) => (
                        <MenuItem value={val} key={idx}>
                          {val}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box>
                <Typography variant="body2" fontWeight={600} mb={0.5}>
                  Items:
                </Typography>
                <Box display="flex" flexDirection="column" gap={0.5}>
                  {order.items?.map((item: any, idx: number) => (
                    <Box
                      key={idx}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      pl={1}
                      borderLeft={2}
                      borderColor="grey.100"
                      fontSize={{ xs: "0.8rem", md: "0.9rem" }}
                    >
                      <Box>
                        {item.product?.name}{" "}
                        <Box component="span" color="text.secondary">
                          × {item.quantity}
                        </Box>
                      </Box>
                      <Box fontWeight={500}>
                        ₹{item.price * item.quantity}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box mt={1} fontSize={{ xs: "0.8rem", md: "0.9rem" }} color="text.secondary">
                <Typography>
                  <strong>Address:</strong>
                </Typography>
                <Typography>
                  {order?.address?.street}, {order?.address?.city}, {order?.address?.state} -{" "}
                  {order?.address?.pincode}, {order?.address?.country}
                </Typography>
                <Typography>
                  <strong>Phone:</strong> {order.phone}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Orders;
