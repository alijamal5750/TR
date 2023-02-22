const Coupon = require("../models/couponModel");
const factroy=require('./handlersFactory');

// @disc get list of Coupon
// @route GET /api/v1/Coupon
// @access private(admin,manager)
exports.getCoupons = factroy.getAll(Coupon);

// @disc Create Coupon
// @route POST /api/v1/Coupon
// @access Private (admin,manager)
exports.createCoupon = factroy.createOne(Coupon);

// @disc get specific Coupon by id
// @route GET /api/v1/Coupon/id
// @access Private (admin,manager)
exports.getCoupon= factroy.getOne(Coupon);

// @disc update specific Coupon
// @route GET /api/v1/Coupon/id
// @access Private (admin,manager)
exports.updateCoupon = factroy.updateOne(Coupon);

// @disc delete specific Coupon
// @route GET /api/v1/Coupon/id
// @access Private (admin,manager)
exports.deleteCoupon = factroy.deleteOne(Coupon);