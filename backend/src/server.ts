const express = require("express");
const dotenv = require("dotenv");
const DBConnnect = require("../src/config/DBConnect")
const createDefaultAdmin = require("../src/config/createDefaultAdmin")
const cors = require("cors")
const authRoutes = require("../src/routes/Auth.routes")
const productRoutes = require("../src/routes/Product.routes")
const providerRoutes = require("../src/routes/ServiceProvider.routes")
const orderRoutes = require("../src/routes/Order.routes")
const adminRoutes = require("../src/routes/Admin.routes")
const paymentRoute = require("../src/routes/payment.routes")

dotenv.config()
DBConnnect().then(() => {
  createDefaultAdmin();
});

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
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