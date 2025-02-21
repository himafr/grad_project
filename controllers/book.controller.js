const BooksModel = require("../models/book.model.js");
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

class BookController {
  /**
   * @description
   * the controller method to fetch all books for a particular user
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the array of books for the user
   */
  static async getAllBooks(req, res, next) {
    try {
      let {query} = req;
      console.log(query)
      query.limit= query.limit||6;
      query.page= query.page||0;
      if(query.page<0)
        return next(new AppError("No books found", STATUS_CODES.NOT_FOUND));
      const [books,nums] = await BooksModel.getAllBooks(req.query);
      if (!books.length)
        return next(new AppError("No books found", STATUS_CODES.NOT_FOUND));
      

      return res.status(STATUS_CODES.OK).json({
        status: "success",
        message: "All books fetched successfully",
        data: {
          books,
          nums,
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
   * the controller method to fetch all books for a particular user
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the array of books for the user
   */
  static async getAdminBooks(req, res, next) {
    try {
      let {query} = req;
      let admin_id=req.user.user_id;
      console.log(query)
      console.log(admin_id)
      query.limit= query.limit||6;
      if(query.page<0)
        return next(new AppError("No books found", STATUS_CODES.NOT_FOUND));
      const [books,nums] = await BooksModel.getAdminBooks(req.query,admin_id);
      if (!books.length)
        return next(new AppError("No books found", STATUS_CODES.NOT_FOUND));
      

      return res.status(STATUS_CODES.OK).json({
        status: "success",
        message: "All books fetched successfully",
        data: {
          books,
          nums,
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
   * the controller method to create a blog for a particular user
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the created blog for the user
   */
  static async createBook(req, res, next) {
    const { body: requestBody } = req;
    requestBody.book_url = req.files.pdf[0].filename;
    const photoPath =req.files.image[0].filename;
    requestBody.book_photo = photoPath;
    requestBody.admin_id = req.user.user_id;
    // requestBody.admin_id = req.user.user_id;
    try {
      const Result = await BooksModel.createBook(requestBody);

      return res.status(STATUS_CODES.SUCCESSFULLY_CREATED).json({
        status:  "success",
        message: "book added successfully",
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
   * the controller method to fetch the blog corresponding to a book id
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the book fetched from the database
   */
  static async getBookById(req, res, next) {
    const bookId = req.params?.id;

    try {
      const [book,review,comments]= await BooksModel.getBookById(bookId);

      if (!book)
        return next(
          new AppError(
            `Book with id ${bookId} not found`,
            STATUS_CODES.NOT_FOUND
          )
        );

      return res.status(STATUS_CODES.OK).json({
        status:  "success",
        message: `Book with id ${bookId} fetched successfully`,
        data: {
          book,
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

  
  static async createComment(req, res, next) {
    const { body: requestBody } = req;
    const book_id=req.params.id;
    requestBody.book_id=book_id;
    requestBody.user_id=req.user.user_id;
    try {
      const Result = await BooksModel.createComment(requestBody);
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
    const book_id=req.params.id;
    requestBody.book_id=book_id;
    requestBody.user_id=req.user.user_id;
    try {
      const Result = await BooksModel.createReview(requestBody);
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
   * the controller method to update some attributes of a blog corresponding to an id
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   */
  static async updateBook(req, res, next) {
    const { body: requestBody } = req;
    const bookId = req.params.id;
    console.log(bookId)

    try {
      const bookToBeUpdated1 = await BooksModel.getBookById(bookId);
      const bookToBeUpdated=bookToBeUpdated1[0]

      if (!bookToBeUpdated)
        return next(
          new AppError(
            `Book with id ${bookId} not found`,
            STATUS_CODES.NOT_FOUND
          )
        );

      if (bookToBeUpdated.admin_id !== req.user.user_id)
        return next(
          new AppError("You are not authorized", STATUS_CODES.FORBIDDEN)
        );

      const updateBookResult = await BooksModel.updateBook(requestBody, bookId);
      if (updateBookResult.affectedRows)
        return res.status(STATUS_CODES.OK).json({
          status:  "success",
          message: `Book with id ${bookId} updated successfully`,
        });
      return next(
        new AppError(
          `Book with id ${bookId} could not be updated`,
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
  static async deleteBook(req, res, next) {
    const bookId = req.params.id;

    const bookToBeDeleted1 = await BooksModel.getBookById(bookId);
    const bookToBeDeleted=bookToBeDeleted1[0]
    try{
      console.log(bookToBeDeleted)
      const storage= await StorageModel.getLoggedInStorage()
      const file = storage.find(bookToBeDeleted.book_url);
      const file2 = storage.find(bookToBeDeleted.book_photo);
      await file.delete();
      await file2.delete();
    }catch (e){
      console.log("easy man")
      console.log(e)
    }
    try {
      if (!bookToBeDeleted)
        return next(
          new AppError(
            `Book with id ${bookId} not found`,
            STATUS_CODES.NOT_FOUND
          )
        );
      if (bookToBeDeleted.doctor_id !== req.user?.id)
        return next(
          new AppError("You are not authorized", STATUS_CODES.FORBIDDEN)
        );
      const deleteBookResult = await BooksModel.deleteBook(bookId);
      if (deleteBookResult.affectedRows)
        return res.status(STATUS_CODES.OK).json({
          status:  "success",
          message: `Book with id ${bookId} deleted successfully`,
        });
      return next(
        new AppError(
          `Book with id ${bookId} could not be deleted`,
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
module.exports = BookController;