import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Button,
  CircularProgress,
  Stack,
} from "@mui/material";

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "STRIPE">("COD");
  const [loading, setLoading] = useState(false);

  /* =====================
     FETCH ORDER
  ===================== */
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/order/${orderId}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error("Failed to fetch order", err);
      }
    };

    fetchOrder();
  }, [orderId]);

  /* =====================
     CONFIRM PAYMENT
  ===================== */
  const handleConfirmPayment = async () => {
    if (!order) return;

    setLoading(true);

    try {
      if (paymentMethod === "COD") {
        // order already created, payment stays Pending
        navigate("/orders");
        return;
      }

      // STRIPE PAYMENT
      const res = await axios.post(`/payment/checkout/${orderId}`);
      window.location.href = res.data.checkoutUrl;
    } catch (err: any) {
      alert("Payment failed");
      setLoading(false);
    }
  };

  if (!order) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
        <Typography ml={2} color="text.secondary">
          Loading payment details...
        </Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="600px" mx="auto" px={2} py={10}>
      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={600} mb={3}>
            Choose Payment Method
          </Typography>

          {/* ORDER INFO */}
          <Card
            variant="outlined"
            sx={{ mb: 4, borderRadius: 1, bgcolor: "#f5f5f5", p: 2 }}
          >
            <Stack spacing={1}>
              <Typography>
                <strong>Order ID:</strong> #{order._id.slice(-6)}
              </Typography>
              <Typography>
                <strong>Total Amount:</strong> ₹{order.totalAmount}
              </Typography>
              <Typography>
                <strong>Status:</strong> {order.paymentStatus}
              </Typography>
            </Stack>
          </Card>

          {/* PAYMENT OPTIONS */}
          <Box>
            <FormLabel component="legend" sx={{ mb: 1 }}>
              Select Payment Method
            </FormLabel>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value as "COD" | "STRIPE")
              }
            >
              <FormControlLabel
                value="COD"
                control={<Radio />}
                label="Cash on Delivery"
              />
              <FormControlLabel
                value="STRIPE"
                control={<Radio />}
                label="Pay Online (Stripe)"
              />
            </RadioGroup>
          </Box>

          {/* CONFIRM BUTTON */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleConfirmPayment}
            disabled={loading}
            sx={{ mt: 4 }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Confirm Payment"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentPage;
