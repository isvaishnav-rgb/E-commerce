const Payment = require("../../models/payment.model");

const getPaymentStatus = async (req: any, res: any) => {
  try {
    const { orderId } = req.params;

    const payment = await Payment.findOne({ order: orderId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      status: payment.status,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment status",
      error: err.message,
    });
  }
};

module.exports = { getPaymentStatus };
