const express = require("express");
const dotenv = require("dotenv");
const DBConnnect = require("../src/config/DBConnect")
const cors = require("cors")
const authRoutes = require("../src/routes/Auth.routes")
const productRoutes = require("../src/routes/Product.routes")
const providerRoutes = require("../src/routes/ServiceProvider.routes")
const orderRoutes = require("../src/routes/Order.routes")
const adminRoutes = require("../src/routes/Admin.routes")

dotenv.config()
DBConnnect();

const app = express();
app.use(cors())
app.use(express.json());

//routes
app.use("/auth", authRoutes)
app.use("/product", productRoutes)
app.use("/provider",  providerRoutes)
app.use("/order", orderRoutes)
app.use("/admin", adminRoutes)

app.get("/", (req: any, res: any)=>{
    res.json("Hello")
})

app.listen(process.env.PORT, ()=>{
   console.log("server is running")
})