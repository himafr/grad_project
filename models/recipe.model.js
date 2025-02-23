const { Database } = require("../config/db.config");
class RecipesModel {
  static async getAllRecipes(query) {
    try {
      const sql = `SELECT  recipes.recipe_id  , recipes.recipe_name,    recipes.instructions,    recipes.recipe_carb,    recipes.ingredients,    recipes.recipe_photo,    categories.category_name FROM     recipes INNER JOIN     categories ON recipes.category_id = categories.category_id LIMIT ${
        query.limit
      } OFFSET ${query.page * query.limit}`;
      const result = await Database.executeQuery(sql);
      const num = `select COUNT(recipe_id)AS nums from recipes;`;
      const nums = await Database.executeQuery(num);
      return [result, nums];
    } catch (err) {
      console.log(err);
    }
  }

  static async getAllAdminRecipes(query) {
    try {
      console.log("query");
      console.log(query.admin_id);
      console.log("query");
      const sql = `SELECT  recipes.recipe_id  , recipes.recipe_name,    recipes.instructions,    recipes.recipe_carb,    recipes.ingredients,    recipes.recipe_photo, recipes.category_id,    categories.category_name FROM     recipes INNER JOIN     categories ON recipes.category_id = categories.category_id   WHERE admin_id = ${
        query.admin_id
      } LIMIT ${query.limit} OFFSET ${query.page * query.limit}`;
      const result = await Database.executeQuery(sql);
      const num = `SELECT COUNT(recipe_id)AS nums from recipes WHERE admin_id = ${query.admin_id};`;
      const nums = await Database.executeQuery(num);
      return [result, nums];
    } catch (err) {
      console.log(err);
    }
  }

  static async getRecipeById(id) {
    const sql = "SELECT * FROM recipes INNER JOIN categories ON recipes.category_id = categories.category_id WHERE recipe_id = ?";
    const reviewsSql = "SELECT * FROM recipe_review INNER JOIN users ON users.user_id=recipe_review.user_id WHERE recipe_id = ?";
    const commentsSql = "SELECT * FROM recipe_comments INNER JOIN users ON users.user_id=recipe_comments.user_id WHERE recipe_id = ?";
    const params = [id];
    const result = await Database.executeQuery(sql, params);
    const review = await Database.executeQuery(reviewsSql, params);
    const comments = await Database.executeQuery(commentsSql, params);
    return [result[0], review, comments];
  }

  static async createRecipe(data) {
    try {
      const sql = `INSERT INTO recipes SET ?`;
      await Database.executeQuery(sql, data);
    } catch (err) {
      console.log(err);
    }
  }
  static async createComment(data) {
    try {
      const sql = `INSERT INTO recipe_comments SET ?`;
      await Database.executeQuery(sql, data);
    } catch (err) {
      console.log(err);
    }
  }
  static async createReview(data) {
    try {
      const sql = `INSERT INTO recipe_review SET ?`;
      await Database.executeQuery(sql, data);
    } catch (err) {
      console.log(err);
    }
  }

  static async updateRecipe(updatedData, id) {
    try {
      const sql = `UPDATE recipes SET ? WHERE recipe_id=?`;
      const params = [updatedData, id];
      const result = await Database.executeQuery(sql, params);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  static async deleteRecipe(id) {
    try {
      const sql = `DELETE FROM recipes WHERE recipe_id=?`;
      const params = [id];
      const result = await Database.executeQuery(sql, params);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = RecipesModel;
