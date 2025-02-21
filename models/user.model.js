const { Database } = require("../config/db.config");
class UserModel {
  static async getAllUsers() {
    try {
      const sql = "SELECT * FROM users";
      const result = await Database.executeQuery(sql);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  static async getUserById(id) {
    try {
      const sql = "SELECT * FROM users where user_id=?";
      const reviewsSql = "SELECT * FROM user_review WHERE med_id = ?";
    const params = [id];
    const result = await Database.executeQuery(sql, params);
    const review = await Database.executeQuery(reviewsSql, params);
    return [result[0], review ];
    } catch (err) {
      console.log(err);
    }
  }
  
  static async createReview(data) {
    try {
      const sql = `INSERT INTO user_review SET ?`;
      await Database.executeQuery(sql, data);
    } catch (err) {
      console.log(err);
    }
  };

  static async updateUser(updatedData, id) {
    try {
      const sql = `UPDATE users SET ? WHERE user_id=?`;
      const params = [updatedData, id];
      const result = await Database.executeQuery(sql, params);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

}
module.exports = UserModel;
