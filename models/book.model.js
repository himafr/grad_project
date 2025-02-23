const { Database } = require("../config/db.config");
class BooksModel {
  static async getAllBooks(query) {
    try {
      const sql = `SELECT * FROM books
      LIMIT ${query.limit} OFFSET ${query.page*query.limit}`;
      const result = await Database.executeQuery(sql);
      const num=`select COUNT(book_id)AS nums from books;`
      const nums = await Database.executeQuery(num);
      return [result, nums];
    } catch (err) {
      console.log(err);
    }
  }
  static async getAdminBooks(query,admin_id) {
    try {
      const sql = `SELECT * FROM books WHERE admin_id = ${admin_id}
      LIMIT ${query.limit} OFFSET ${query.page*query.limit}`;
      const result = await Database.executeQuery(sql);
      const num=`select COUNT(book_id)AS nums from books WHERE admin_id = ${admin_id};`
      const nums = await Database.executeQuery(num);
      return [result, nums];
    } catch (err) {
      console.log(err);
    }
  }

  static async getBookById(id) {
    const sql = "SELECT * FROM books WHERE book_id = ?";
    const params = [id];
    const reviewsSql = "SELECT * FROM book_review INNER JOIN users ON users.user_id=book_review.user_id WHERE book_id = ?";
    const commentsSql = "SELECT * FROM book_comments INNER JOIN users ON users.user_id=book_comments.user_id WHERE book_id = ?";
    const result = await Database.executeQuery(sql, params);
    const review = await Database.executeQuery(reviewsSql, params);
    const comments = await Database.executeQuery(commentsSql, params);
    return [result[0], review, comments]; }

    static async createComment(data) {
      try {
        const sql = `INSERT INTO book_comments SET ?`;
        await Database.executeQuery(sql, data);
      } catch (err) {
        console.log(err);
      }
    };
    static async createReview(data) {
      try {
        const sql = `INSERT INTO book_review SET ?`;
        await Database.executeQuery(sql, data);
      } catch (err) {
        console.log(err);
      }
    };
  
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
      const sql = `UPDATE books SET ? WHERE book_id=?`;
      const params = [updatedData, id];
      const result = await Database.executeQuery(sql, params);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  static async deleteBook(id) {
    try {
      const sql = `DELETE FROM books WHERE book_id=?`;
      const params = [id];
      const result = await Database.executeQuery(sql, params);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = BooksModel;
