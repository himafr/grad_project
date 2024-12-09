const { Database } = require("../config/db.config");
class BooksModel {
  static async getAllBooks() {
    try {
      const sql = "SELECT * FROM books";
      const result = await Database.executeQuery(sql);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  static async getBookById(id) {
    const sql = "SELECT * FROM books WHERE book_id = ?";
    const params = [id];
    const result = await Database.executeQuery(sql, params);
    return result[0];
  }

  static async createBook(body) {
    try {
      const sql = `INSERT INTO books SET ?`;
      await Database.executeQuery(sql, body);
    } catch (err) {
      console.log(err);
    }
  }
  static async updateBook(updatedData, id) {
    try {
      const sql = `UPDATE books SET ? WHERE id=?`;
      const params = [updatedData, id];
      const result = await Database.executeQuery(sql, params);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  static async deleteBook(id) {
    try {
      const sql = `DELETE FROM books WHERE id=?`;
      const params = [id];
      const result = await Database.executeQuery(sql, params);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = BooksModel;
