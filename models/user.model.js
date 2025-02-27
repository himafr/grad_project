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
  
  static async getPatientData(id,month) {
    try {
      const sql = ` SELECT bgm_num FROM user_bgm WHERE MONTH(bgm_date) = ${month} AND YEAR(bgm_date) = YEAR(CURRENT_DATE) AND user_id=?`;
      const sql2 = ` SELECT bgm_num FROM user_bgm WHERE MONTH(bgm_date) = ${month-1} AND YEAR(bgm_date) = YEAR(CURRENT_DATE) AND user_id=?`;


      const sql3 = "SELECT * FROM user_bgm where user_id = ?";

    const params = [id];
    const result = await Database.executeQuery(sql, params);
    const result2 = await Database.executeQuery(sql2, params);
    const result3 = await Database.executeQuery(sql3, params);
    console.log(id)
    return [result3, result , result2];
    } catch (err) {
      console.log(err);
    }
  }
  
  static async getPatientList(id) {
    try {
      const sql = `SELECT users. * FROM users LEFT JOIN doctor_patient ON users.user_id = doctor_patient.user_id WHERE doctor_patient.user_id IS NULL AND role='patient';`;
      const sql2=`SELECT users.*
FROM users
JOIN doctor_patient ON users.user_id = doctor_patient.user_id
WHERE doctor_patient.doctor_id = ? ;
`
    const params = [id];
    const result = await Database.executeQuery(sql);
    const myPatient = await Database.executeQuery(sql2,params);
    return [myPatient,result];
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
