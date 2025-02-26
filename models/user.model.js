const { Database } = require("../config/db.config");
class UserModel {
  static async getAllUsers() {
    try {
      const sql = "SELECT * FROM users";
      const sql2 = "SELECT role,  DATE_FORMAT(created_at, '%Y-%m') as month,  COUNT(*) as count FROM   users GROUP BY     role, month ORDER BY    month, role;";
      const result = await Database.executeQuery(sql);
      const series = await Database.executeQuery(sql2);
      return [result,series];
    } catch (err) {
      console.log(err);
    }
  }
  static async getUserById(id) {
    try {
      const sql = "SELECT * FROM users where user_id=?";
      const reviewsSql = "SELECT * FROM user_review INNER JOIN users ON users.user_id=user_review.user_id WHERE users.user_id = ?";
    const params = [id];
    const result = await Database.executeQuery(sql, params);
    const review = await Database.executeQuery(reviewsSql, params);
    console.log(id)
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
