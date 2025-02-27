const express = require("express");
const medController = require("../controllers/medicine.controller");
const medMaker = require("../middlewares/img.uploader.middleware");
const authController = require("../controllers/auth.controller");
const { mega } = require("../middlewares/mega.middleware");
const router = express.Router();
router.post("/comments/:id",medController.createComment)
router.post("/review/:id",medController.createReview)
router.get("/pharm",medController.getMedData)
router
  .route("/")
  .get( medController.getAllMeds)
  .post(
    authController.restrictTo("pharmacy"),
    medMaker.imgUpload.single("med_photo"),
    medMaker.check,
    mega,
    medController.createMed
  );
router
  .route("/:id")
  .get(medController.getMedById)
  .patch(authController.restrictTo("pharmacy"),medController.updateMed)
  .delete(authController.restrictTo("pharmacy"), medController.deleteMed);
module.exports = router;
