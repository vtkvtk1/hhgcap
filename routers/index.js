const router = require("express").Router();
const {
  about,
  activePlans,
  confirmation,
  contactUs,
  dashboard,
  faq,
  paid,
  index,
  editAccount,
  referral,
  invest,
  signin,
  signup,
  rules,
  withdrawals,
  deposit,
  userinvest,
  submitContact,
  affiliate,
  userwithdraw,
  rollover,
  postsignin,
  postsignup,
  postlogout,
  addAddress                                                                           
} = require("../controllers/index");
const cloudinary = require("cloudinary");
const multer = require("multer");
const Deposit = require("../models/Deposit");
const Kycupload = require("../models/Kyc");
const User = require("../models/User");
require("dotenv").config();

var storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
var imageFilter = function (req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter });

cloudinary.config({
  cloud_name: "avwunufe",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.route("/").get(index);
router.route("/index").get(index);
router.route("/about-us").get(about);
router.route("/affiliate").get(affiliate);
router.route("/activePlans").get(activePlans);
router.route("/confirmation").get(confirmation);
router.route("/contact-us").get(contactUs);
router.route("/deposit").get(deposit);
router.route("/dashboard").get(dashboard);
router.route("/referral").get(referral);
router.route("/faq").get(faq);
router.route("/invest").get(invest);
router.route("/login").get(signin);
router.route("/payouts").get(paid);
router.route("/editAccount").get(editAccount);
router.route("/terms-and-conditions").get(rules);
router.route("/sign-up").get(signup);
router.route("/withdrawals").get(withdrawals);
router.route("/invest").post(userinvest);
router.route("/withdraw").post(userwithdraw);
router.route("/contact").post(submitContact);
router.route("/rollover").post(rollover);
router.route("/signup").post(postsignup);
router.route("/login").post(postsignin);
router.route("/logout").get(postlogout);
router.route("/address").post(addAddress);
router.post("/deposit", upload.single("image"), async (req, res, next) => {
  const result = await cloudinary.uploader.upload(req.file.path);
  const obj = {
    ...req.body,
    userName: req.user.userName,
    imagePath: result.secure_url,
    publicId: result.public_id,
  };
  if (req.user.referrer != "") {
    const referrer = await User.findOne({ username: req.user.referrer });
    if (!referrer) {
      await Deposit.create(obj);
      return res.redirect("/deposit");
    }
    referrer.refBonus += req.body.amount * 0.1;
    await referrer.save();
  }
  await Deposit.create(obj);
  return res.redirect("/deposit");
});
router.post("/kycupload", upload.single("image"), async (req, res, next) => {
  const result = await cloudinary.uploader.upload(req.file.path);
  const obj = {
    ...req.body,
    imagePath: result.secure_url,
    publicId: result.public_id,
  };
  await Kycupload.create(obj);
  return res.redirect("/dashboard");
});

module.exports = router;
