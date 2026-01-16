const express = require("express");
const router = express.Router();

const {
  applyOrUpdateApplication,
} = require("../controllers/serviceProvider/ServiceProviderApplication");

const AuthJWT = require("../middlewares/auth/AuthJWT");
const { allowRoles } = require("../middlewares/auth/RoleAuth");
const uploadKycDocs = require("../middlewares/upload/KycUpload");

/*
  Expecting:
  - files[] → KYC images
  - documentTypes[] → Aadhaar / PAN
*/
router.post(
  "/apply",
  AuthJWT,
  allowRoles("user"),
  uploadKycDocs.array("documents", 2),
  applyOrUpdateApplication
);

module.exports = router;
