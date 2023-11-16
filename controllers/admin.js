const mongoose = require("mongoose")
const User = require("../models/User");
const Deposit = require("../models/Deposit");
const Withdrawal = require("../models/Withdrawal");
const Plan = require("../models/Plan");
const asyncHandler = require("../middleware/async");
const passport = require("passport");

// @desc Renders admin login page
// @access public
exports.login = asyncHandler(async(req, res, next) => {
    res.render("admin/login");
});
// @desc Renders admin dashboard page
// @access public
exports.index = asyncHandler(async(req, res, next) => {
    const users = await User.find({});
    res.render("admin/index", { users });
});
// @desc Renders admin client deposits page
// @access public
exports.deposits = asyncHandler(async(req, res, next) => {
    const users = await User.find({});
    const deposits = await Deposit.find({});
    res.render("admin/clientdeposits", { users, deposits });
});
// @desc Renders admin investments page
// @access public
exports.investmentplans = asyncHandler(async(req, res, next) => {
    const users = await User.find({});
    const plans = await Plan.find({});
    res.render("admin/investmentplans", { users, plans });
});
// @desc Renders admin client withdrawals page
// @access public
exports.withdrawals = asyncHandler(async(req, res, next) => {
    const users = await User.find({});
    const withdrawals = await Withdrawal.find({});
    res.render("admin/clientwithdrawals", { users, withdrawals });
});
// @desc Renders admin client withdrawals page
// @access public
exports.manageusers = asyncHandler(async(req, res, next) => {
    const users = await User.find({});
    res.render("admin/manageusers", { users });
});
// @desc Logs an admin in
// @access public
exports.adminlogin = asyncHandler(async(req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/tarvixxx/index",
        failureRedirect: "/tarvixxx/login",
        failureFlash: false,
    })(req, res, next);
});
// @desc Logs an admin in
// @access public
exports.addProfit = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.body.userId);
    user.profit = user.profit + parseInt(req.body.profitAmount);
    await user.save();
    res.send({ success: true });
});
exports.addBalance = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.body.userId);
    user.balance = user.balance + parseInt(req.body.balanceAmount);
    await user.save();
    res.send({ success: true });
});
exports.addDeposit = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.body.userId);
    const depositAmount = parseInt(req.body.depositAmount)
    if(user.referrer){
        const referrer = await User.findOne({username: user.referrer});
        referrer.refBonus = referrer.refBonus + depositAmount / 10;
        await referrer.save()
    }
    user.deposits = user.deposits + parseInt(req.body.depositAmount);
    await user.save();
    res.send({ success: true });
});
exports.approveDeposit = asyncHandler(async(req, res, next) => {
    const deposit = await Deposit.findById(req.body.userId);
    deposit.status = "Confirmed";
    await deposit.save();
    res.send({ success: true });
});
exports.updatePlan = asyncHandler(async(req, res, next) => {
    const planId =  mongoose.Types.ObjectId(req.body.planId);
    await Plan.findByIdAndUpdate(planId, {
       name: req.body.name,
       min: req.body.min,
       max: req.body.max,
       profit: req.body.profit,
       returns: req.body.returns,
    } );
    res.send({ success: true });
});