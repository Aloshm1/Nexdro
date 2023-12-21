const express = require("express");
const multer = require('multer');
const { signup, getUsers, registerUser, loginUser, checkEmail, checkPilot, checkCompany, checkCenter, verifyMail, checkPhoneNo, forgetPassword, recoverPassword, pilotDetails, companyDetails, centerDetails, checkUser, updateProfilePic, updateCoverPic, updateNotifications, getUserData, updateProfilePicServiceCenter, updateCoverPicServiceCenter, emailResend, getBooster, updateProfilePicBooster, updateCoverPicBooster, updateBasicInfo, updateBoosterRole, getUserDataBookmarks, updateProfilePicCompany, updateCoverPicCompany, checkPilotPro, getCenterId, createNewUser, testLookup, getDateUsers, checkIp, checkuserNameProfile, subscribeJobAlerts, editEmail, mailToReverify, getRoute, newEmailRequest, changeEmailId, test } = require("../controller/userController");
const { protect } = require("../middlewares/auth");
const { protectPilot } = require("../middlewares/createPilot");
const router = express.Router();
const profileImage = require("../middlewares/profileImage")



const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '')
    }
})

const upload1 = multer({storage}).single('file')
router.post("/register",registerUser)
router.post("/login", loginUser)
router.post("/checkMail", checkEmail)
router.post("/checkPhoneNo", checkPhoneNo)
router.post("/checkPilot",protect, checkPilot)
router.post("/checkCompany",protect, checkCompany)
router.post("/checkCenter",protect, checkCenter)
router.get("/verifyMail/:id/verify/:token", verifyMail)
router.post("/forgetPassword", forgetPassword)
router.post("/recoverPassword/:id/verify/:token", recoverPassword)
router.post("/pilotDetails",protect, pilotDetails)
router.post("/companyDetails",protect, companyDetails)
router.post("/centerDetails",protect, centerDetails)
router.post("/checkUser",protect, checkUser)
router.post("/updateProfilePic", protectPilot ,upload1, updateProfilePic);
router.post("/updateCoverPic", protectPilot ,upload1, updateCoverPic);
router.post("/updateNotifications", protectPilot,  updateNotifications);
router.get("/getUserData", protectPilot,  getUserData);
router.post("/updateProfilePicServiceCenter", protectPilot ,upload1, updateProfilePicServiceCenter);
router.post("/updateCoverPupdateCoverPicServiceCenteric", protectPilot ,upload1, updateCoverPicServiceCenter);
router.post("/emailResend", protect,  emailResend);
router.get("/getBooster", protectPilot ,  getBooster);
router.post("/updateProfilePicBooster", protectPilot ,upload1, updateProfilePicBooster);
router.post("/updateCoverPicBooster", protectPilot ,upload1, updateCoverPicBooster);
router.post("/updateBasicInfo", protectPilot ,updateBasicInfo);
router.post("/updateBoosterRole", protect , updateBoosterRole );
router.get("/getUserDataBookmarks", protectPilot,  getUserDataBookmarks);
router.get("/getUsers", getUsers);
router.post("/updateProfilePicCompany", protectPilot ,upload1, updateProfilePicCompany);
router.post("/updateCoverPicCompany", protectPilot ,upload1, updateCoverPicCompany);
router.get("/checkPilotPro", protectPilot, checkPilotPro)
router.post("/getCenterId", getCenterId)
router.post("/createNewUser", createNewUser)
router.get("/testLookup", testLookup)
router.post("/getDateUsers", getDateUsers)
router.get("/checkIp", checkIp)
router.post("/checkuserNameProfile", protectPilot, checkuserNameProfile)
router.post("/subscribeJobAlerts", subscribeJobAlerts)
router.post("/editEmail",protectPilot, editEmail)
router.post("/mailToReverify", protectPilot, mailToReverify)
router.post("/getRoute/:id", getRoute)
router.post("/newEmailRequest", newEmailRequest)
router.post("/changeEmailId", protectPilot, changeEmailId)
router.post("/test", test)
module.exports = router;