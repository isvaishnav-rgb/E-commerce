const express = require("express");
const router = express.Router();

const {
  applyOrUpdateApplication,
  getMyServiceProviderApplication
} = require("../controllers/serviceProvider/ServiceProviderApplication");

const AuthJWT = require("../middlewares/auth/AuthJWT");
const { allowRoles } = require("../middlewares/auth/RoleAuth");
const uploadKycDocs = require("../middlewares/upload/Upload");

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

router.get(
  "/my-application",
  AuthJWT,
  allowRoles("user","provider"),
  getMyServiceProviderApplication
);

module.exports = router;
