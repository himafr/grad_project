const express = require("express");
const RecipeController = require("../controllers/recipe.controller");
const recipeMaker = require("../middlewares/img.uploader.middleware");
const authController = require("../controllers/auth.controller");
const { mega } = require("../middlewares/mega.middleware");
const router = express.Router();
router.post("/review/:id",RecipeController.createReview)
router.get("/apk",RecipeController.getAllRecipesApk)
router
  .route("/")
  .get( RecipeController.getAllRecipes)
  .post(
    authController.restrictTo("admin"),
    recipeMaker.imgUpload.single("recipe_photo"),
    recipeMaker.checkRecipe,
    mega,
    RecipeController.createRecipe
  );
router
  .route("/:id")
  .get(RecipeController.getRecipeById)
  .patch(authController.restrictTo("admin"),RecipeController.updateRecipe)
  .delete(authController.restrictTo("admin"), RecipeController.deleteRecipe);
module.exports = router;
