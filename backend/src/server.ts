const express = require("express");
const dotenv = require("dotenv");
const DBConnnect = require("./config/DBConnect")
const createDefaultAdmin = require("./config/createDefaultAdmin")
const cors = require("cors")
const authRoutes = require("./routes/Auth.routes")
const productRoutes = require("./routes/Product.routes")
const providerRoutes = require("./routes/ServiceProvider.routes")
const orderRoutes = require("./routes/Order.routes")
const adminRoutes = require("./routes/Admin.routes")
const paymentRoute = require("./routes/payment.routes")

dotenv.config()
DBConnnect().then(() => {
  createDefaultAdmin();
});

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

//routes
app.use("/auth", authRoutes)
app.use("/product", productRoutes)
app.use("/provider",  providerRoutes)
app.use("/order", orderRoutes)
app.use("/admin", adminRoutes)
app.use("/payment", paymentRoute)

app.get("/", (req: any, res: any)=>{
    res.json("Hello")
})

app.listen(process.env.PORT, ()=>{
   console.log(`🚀 Server running on port ${process.env.PORT}`)
   console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`)
})