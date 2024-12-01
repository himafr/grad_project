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
      const books = await BooksModel.getAllBooks();

      if (!books.length)
        return next(new AppError("No blog found", STATUS_CODES.NOT_FOUND));

      res.status(STATUS_CODES.OK).json({
        status: "success",
        message: "All books fetched successfully",
        data: {
          books,
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
    requestBody.book_url = req.files.pdf[0].path;

    const photoPath =req.files.image[0].path;
    requestBody.book_photo = photoPath;
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
      const book = await BooksModel.getBookById(bookId);

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
    try {
      const bookToBeUpdated = await BooksModel.getBookById(bookId);

      if (!bookToBeUpdated)
        return next(
          new AppError(
            `Book with id ${bookId} not found`,
            STATUS_CODES.NOT_FOUND
          )
        );

      if (bookToBeUpdated.doctor_id !== req.user.id)
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

    try {
      const bookToBeDeleted = await BooksModel.getBookById(bookId);

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
      await fs.unlinkSync(bookToBeDeleted.book_url);
      await fs.unlinkSync(bookToBeDeleted.book_photo);
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