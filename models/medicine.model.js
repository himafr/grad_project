const { Database } = require("../config/db.config");
class MedsModel {
  static async getAllMeds() {
    try {
      const sql = "SELECT * FROM meds";
      const result = await Database.executeQuery(sql);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  static async getMedById(id) {
    const sql = "SELECT * FROM meds WHERE med_id = ?";
    const params = [id];
    const result = await Database.executeQuery(sql, params);
    return result[0];
  }

  static async createMed(data) {
    try {
      const sql = `INSERT INTO meds SET ?`;
      await Database.executeQuery(sql, data);
    } catch (err) {
      console.log(err);
    }
  }
  static async updateMed(updatedData, id) {
    try {
      const sql = `UPDATE meds SET ? WHERE med_id=?`;
      const params = [updatedData, id];
      const result = await Database.executeQuery(sql, params);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  static async deleteMed(id) {
    try {
      const sql = `DELETE FROM meds WHERE med_id=?`;
      const params = [id];
      const result = await Database.executeQuery(sql, params);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = MedsModel;
