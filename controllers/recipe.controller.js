const RecipesModel = require("../models/recipe.model.js");
const AppError = require("../utils/appError");
const fs = require("fs");
const path = require("path");
const {
  STATUS_CODES,
  cookieAttributeForJwtToken,
  dbErrorCodes,
  userAuthRequiredFields,
} = require("../helpers/constants.js");
const { request } = require("express");
const StorageModel = require("../middlewares/mega.middleware.js");

class RecipeController {
  /**
   * @description
   * the controller method to fetch all recipes for a particular user
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the array of recipes for the user
   */
  static async getAllRecipes(req, res, next) {
    try {
      let {query} = req;
      console.log(query)
      query.limit= query.limit||6;
      query.page= query.page||0;
      
      if(query.page<0)
        return next(new AppError("No recipe found", STATUS_CODES.NOT_FOUND));
      console.log(req.user)
      if(req.user.role == "admin"){
        query.admin_id =req.user.user_id;
     const    [recipes,nums] = await RecipesModel.getAllAdminRecipes(query);
         if (recipes.length==0){return next(new AppError("No recipe found", STATUS_CODES.NOT_FOUND))};

         
       return res.status(STATUS_CODES.OK).json({
         status: "success",
         message: "All recipes fetched successfully",
         data: {
           recipes,
           nums,
         },
       })
        }
        const  [recipes,nums] = await RecipesModel.getAllRecipes(query);
          if (recipes.length==0){return next(new AppError("No recipe found", STATUS_CODES.NOT_FOUND))};

          
        res.status(STATUS_CODES.OK).json({
          status: "success",
          message: "All recipes fetched successfully",
          data: {
            recipes,
            nums,
          },
        })
        
       
       
    } catch (error) {
      return next(
        new AppError(
          error.message || "Internal Server Error",
          error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
          error.response || error
        )
      );
    }
  }
  static async getAllRecipesApk(req, res, next) {
    try {
    
  


      const  [recipes,nums] = await RecipesModel.getAllRecipesApk();
         
       return res.status(STATUS_CODES.OK).json({
         status: "success",
         message: "All recipes fetched successfully",
         data: {
           recipes,
           nums,
         },
       }) 
    } catch (error) {
      return next(
        new AppError(
          error.message || "Internal Server Error",
          error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
          error.response || error
        )
      );
    }
  }

  /**
   * @description
   * the controller method to create a blog for a particular user
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the created blog for the user
   */
  static async createRecipe(req, res, next) {
    const { body: requestBody } = req;
    requestBody.recipe_photo = req.file?.filename||'not found';
    requestBody.admin_id = req.user.user_id;
    try{
      requestBody.recipe_carb=parseInt(requestBody.recipe_carb)
    }catch{
      return next(new AppError("Invalid recipe carb format", STATUS_CODES.BAD_REQUEST))
    }
    try {
      const Result = await RecipesModel.createRecipe(requestBody);
      return res.status(STATUS_CODES.SUCCESSFULLY_CREATED).json({
        status: "success",
        message: "recipe added successfully",
        data: {
          Result,
        },
      }); 
    } catch (error) {
      return next(
        new AppError(
          error.message || "Internal Server Error",
          error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
          error.response || error
        )
      );
    }
  }
  static async createComment(req, res, next) {
    const { body: requestBody } = req;
    const recipe_id=req.params.id;
    requestBody.recipe_id=recipe_id;
    requestBody.user_id=req.user.user_id;
    try {
      console.log(requestBody)
      const Result = await RecipesModel.createComment(requestBody);
      return res.status(STATUS_CODES.SUCCESSFULLY_CREATED).json({
        status: "success",
        message: "comment added successfully",
        data: {
          Result,
        },
      }); 
    } catch (error) {
      return next(
        new AppError(
          error.message || "Internal Server Error",
          error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
          error.response || error
        )
      );
    }
  }
  static async createReview(req, res, next) {
    const { body: requestBody } = req;
    const recipe_id=req.params.id;
    requestBody.recipe_id=recipe_id;
    requestBody.user_id=req.user.user_id;
    try {
      const Result = await RecipesModel.createReview(requestBody);
      return res.status(STATUS_CODES.SUCCESSFULLY_CREATED).json({
        status: "success",
        message: "review added successfully",
        data: {
          Result,
        },
      }); 
    } catch (error) {
      return next(
        new AppError(
          error.message || "Internal Server Error",
          error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
          error.response || error
        )
      );
    }
  }

  /**
   * @description
   * the controller method to fetch the blog corresponding to a med id
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the med fetched from the database
   */
  static async getRecipeById(req, res, next) {
    const recipeId = req.params.id;

    try {
      const [recipe,review,comments] = await RecipesModel.getRecipeById(recipeId);

      if (!recipe)
        return next(
          new AppError(
            `recipe with id ${recipeId} not found`,
            STATUS_CODES.NOT_FOUND
          )
        );
      return res.status(STATUS_CODES.OK).json({
        status: "success",
        message: `recipe with id ${recipeId} fetched successfully`,
        data: {
          recipe,
          review,
          comments,
        },
      });
    } catch (error) {
      return next(
        new AppError(
          error.message || "Internal Server Error",
          error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
          error.response || error
        )
      );
    }
  }

  /**
   * @description
   * the controller method to update some attributes of a blog corresponding to an id
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   */
  static async updateRecipe(req, res, next) {
    const { body: requestBody } = req;
    const recipeId = req.params.id;
    delete requestBody.recipe_created_at;
    delete requestBody.recipe_photo;
    delete requestBody.recipe_id;
    delete requestBody.admin_id;
    try {
      const recipeToBeUpdated1 = await RecipesModel.getRecipeById(recipeId);
      const recipeToBeUpdated=recipeToBeUpdated1[0];

      if (!recipeToBeUpdated)
        return next(
          new AppError(
            `recipe with id ${recipeId} not found`,
            STATUS_CODES.NOT_FOUND
          )
        );

      if (recipeToBeUpdated.admin_id !== req.user.user_id)
        return next(
          new AppError("You are not authorized", STATUS_CODES.FORBIDDEN)
        );

      const updateRecipeResult = await RecipesModel.updateRecipe(requestBody, recipeId);
      if (updateRecipeResult.affectedRows)
        return res.status(STATUS_CODES.OK).json({
          status:"success",
          message: `recipe with id ${recipeId} updated successfully`,
        });
      return next(
        new AppError(
          `recipe with id ${recipeId} could not be updated`,
          STATUS_CODES.BAD_REQUEST
        )
      );
    } catch (error) {
      return next(
        new AppError(
          error.message || "Internal Server Error",
          error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
          error.response || error
        )
      );
    }
  }

  /**
   * @description
   * the controller method to delete a blog corresponding to an id
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   */
  static async deleteRecipe(req, res, next) {
    const recipeId = req.params.id;
    const recipeToBeDeleted1 = await RecipesModel.getRecipeById(recipeId);
    const recipeToBeDeleted =recipeToBeDeleted1[0]
    try{
      const storage= await StorageModel.getLoggedInStorage()
      const file = storage.find(recipeToBeDeleted.recipe_photo);
      await file.delete();
    }catch{
        console.log("easy man")
      }
    try {
      if (!recipeToBeDeleted)
        return next(
          new AppError(
            `recipe with id ${recipeId} not found`,
            STATUS_CODES.NOT_FOUND
          )
        );
      if (recipeToBeDeleted.admin_id !== req.user.user_id)
        return next(
          new AppError("You are not authorized", STATUS_CODES.FORBIDDEN)
        );
      const deleteRecipeResult = await RecipesModel.deleteRecipe(recipeId);
      if (deleteRecipeResult.affectedRows)
        return res.status(STATUS_CODES.OK).json({
          status: "success",
          message: `recipe with id ${recipeId} deleted successfully`,
        });
      return next(
        new AppError(
          `recipe with id ${recipeId} could not be deleted`,
          STATUS_CODES.BAD_REQUEST
        )
      );
    } catch (error) {
      return next(
        new AppError(
          error.message || "Internal Server Error",
          error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
          error.response || error
        )
      );
    }
  }
}
module.exports = RecipeController;