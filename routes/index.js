const categroryRoute = require("./categoryRoute");
const subCategoryRoute = require("./subCategoryRoute");
const brandRoute = require("./brandRoute");
const productRoute = require("./prodcutRoute");
const userRoute=require('./userRoute');
const authRoute=require('./authRoute');
const reviewRoute=require('./reviewRoute');
const wishlistRoute=require('./wishlistRoute');
const addressesRoute=require('./addressesRoute');
const couponRoute=require('./couponRoute');
const cartRoute=require('./cartRoute');
const orderRoute=require('./orderRoute');

const mountRoutes=(app) =>{
    app.use("/api/v1/categories", categroryRoute);
    app.use("/api/v1/subCategories", subCategoryRoute);
    app.use("/api/v1/brands",brandRoute)
    app.use("/api/v1/products",productRoute);
    app.use("/api/v1/users",userRoute);
    app.use("/api/v1/auth",authRoute);
    app.use("/api/v1/reviews",reviewRoute);
    app.use("/api/v1/wishlist",wishlistRoute);
    app.use("/api/v1/addresses",addressesRoute);
    app.use("/api/v1/coupon",couponRoute);
    app.use("/api/v1/cart",cartRoute);
    app.use("/api/v1/order",orderRoute);

};

module.exports=mountRoutes;