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
