const { Database } = require("../config/db.config");
class MedsModel {
  static async getAllMeds(query) {
    try {
      const sql = `SELECT * FROM meds LIMIT ${query.limit} OFFSET ${query.page*query.limit}`;
      const result = await Database.executeQuery(sql);
      const num=`select COUNT(med_id)AS nums from meds;`
      const nums = await Database.executeQuery(num);
      return [result,nums];
    } catch (err) {
      console.log(err);
    }
  };

  static async getAllPharmMeds(query) {
    try {
      const sql = `SELECT * FROM meds  WHERE pharm_id = ${query.pharm_id} LIMIT ${query.limit} OFFSET ${query.page*query.limit}`;
      const result = await Database.executeQuery(sql);
      const num=`select COUNT(med_id)AS nums from meds WHERE pharm_id = ${query.pharm_id};`
      const nums = await Database.executeQuery(num);
      return [result,nums];
    } catch (err) {
      console.log(err);
    }
  };

  static async getMedById(id) {
    const sql = "SELECT * FROM meds WHERE med_id = ?";
    const reviewsSql = "SELECT * FROM med_review INNER JOIN users ON users.user_id = med_review.user_id WHERE med_id = ?";
    const params = [id];
    const result = await Database.executeQuery(sql, params);
    const review = await Database.executeQuery(reviewsSql, params);
    return [result[0], review];
  };

  static async getMedData(id) {
    const sql = "SELECT * FROM meds WHERE pharm_id !=  ?";
    const sql2 = "SELECT * FROM meds WHERE pharm_id =  ?";
    const params = [id];
    const otherMed = await Database.executeQuery(sql, params);
    const myMed = await Database.executeQuery(sql2, params);
    return [myMed,otherMed];
  };

  static async createMed(data) {
    try {
      const sql = `INSERT INTO meds SET ?`;
      await Database.executeQuery(sql, data);
    } catch (err) {
      console.log(err);
    }
  };
  static async createComment(data) {
    try {
      const sql = `INSERT INTO med_comments SET ?`;
      await Database.executeQuery(sql, data);
    } catch (err) {
      console.log(err);
    }
  };
  static async createReview(data) {
    try {
      const sql = `INSERT INTO med_review SET ?`;
      await Database.executeQuery(sql, data);
    } catch (err) {
      console.log(err);
    }
  };

  static async updateMed(updatedData, id) {
    try {
      const sql = `UPDATE meds SET ? WHERE med_id=?`;
      const params = [updatedData, id];
      const result = await Database.executeQuery(sql, params);
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  static async deleteMed(id) {
    try {
      const sql = `DELETE FROM meds WHERE med_id=?`;
      const params = [id];
      const result = await Database.executeQuery(sql, params);
      return result;
    } catch (err) {
      console.log(err);
    }
  };

}
module.exports = MedsModel;
