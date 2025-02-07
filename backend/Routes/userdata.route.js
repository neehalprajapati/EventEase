const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authentication = require("../middlewares/authentication");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/hall-service", userController.getHallService);
router.get("/decoration-service", userController.getDecorationService);
router.get("/catering-service", userController.getCateringService);
router.get("/user", authentication, userController.user);
router.get("/:id", userController.getById);
router.put("/:id", userController.updateById);
router.post(
  "/upload-image/:userId",
  upload.single("image"),
  userController.uploadImage
);
router.post("/delete-image/:userId", userController.deleteImage);
router.put("/set-thumbnail/:userId", userController.setThumbnail);
router.get("/wishlist/:customer_id", userController.getWishlist);
router.post("/wishlist/add", userController.addToWishlist);
router.delete("/wishlist/remove", userController.deleteWishlist);
router.post("/sendQuery", userController.sendQuery)
module.exports = router;
