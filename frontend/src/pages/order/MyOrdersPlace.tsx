import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchMyOrders } from "../../features/order/orderSlice";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

const statusColors: Record<string, "default" | "success" | "warning" | "info" | "error"> = {
  Created: "warning",
  Shipped: "info",
  Delivered: "success",
};

const MyOrdersPage = () => {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  /* Loading */
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
        <Typography ml={2} color="text.secondary">
          Loading your orders...
        </Typography>
      </Box>
    );
  }

  /* Empty State */
  if (!orders.length) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="70vh"
        textAlign="center"
      >
        <ShoppingBagIcon fontSize="large" color="primary" />
        <Typography variant="h6" fontWeight={600} mt={2}>
          No orders yet
        </Typography>
        <Typography color="text.secondary" mt={1}>
          Once you place an order, it will appear here
        </Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="1200px" mx="auto" px={2} py={4}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        My Orders
      </Typography>

      <Stack spacing={3}>
        {orders.map((order: any) => (
          <Card key={order._id} variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              {/* Order Header */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Order ID
                  </Typography>
                  <Typography fontWeight={600}>#{order._id.slice(-6)}</Typography>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={order.status}
                    color={statusColors[order.status]}
                    size="small"
                  />
                  <Typography fontWeight={600} color="primary">
                    ₹{order.totalAmount}
                  </Typography>
                </Stack>
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* Payment + Status */}
              <Stack direction="row" alignItems="center" spacing={1} color="text.secondary" fontSize={14}>
                {order.status === "Created" && <Inventory2Icon fontSize="small" />}
                {order.status === "Shipped" && <LocalShippingIcon fontSize="small" />}
                {order.status === "Delivered" && <CheckCircleIcon fontSize="small" />}
                <Typography variant="body2">
                  Payment: <strong style={{ textTransform: "capitalize" }}>{order?.payment?.status}</strong>
                </Typography>
              </Stack>

              {/* Items */}
              <Stack mt={2} spacing={1}>
                {order.items.map((item: any) => (
                  <Stack
                    key={item._id}
                    direction="row"
                    justifyContent="space-between"
                    fontSize={14}
                  >
                    <Typography color="text.secondary">
                      {item.product.name} × {item.quantity}
                    </Typography>
                    <Typography fontWeight={500}>₹{item.price * item.quantity}</Typography>
                  </Stack>
                ))}
              </Stack>

              {/* Address */}
              <Box mt={2} fontSize={14} color="text.secondary">
                <Typography>
                  <strong>Address:</strong> Street: {order?.address?.street}, City: {order?.address?.city}, State: {order?.address?.state}, PinCode: {order?.address?.pincode}, Country: {order?.address?.country}
                </Typography>
                <Typography>
                  <strong>Phone:</strong> {order.phone}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default MyOrdersPage;
