const AuthModel = require("../models/auth.model.js");
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
const UserModel = require("../models/user.model.js");
const StorageModel = require("../middlewares/mega.middleware.js");

class UserController {
  
  static async getAllUser(req, res, next) {
    const userId = req.user.user_id;
    
    try {
      const [users, series] = await UserModel.getAllUsers();
      
      if (!users)
        return next(
      new AppError(`Users are not exist`, STATUS_CODES.NOT_FOUND)
    );
    res.status(STATUS_CODES.OK).json({
      status: "success",
      message: `successfully fetched users`,
      data: {
        users,
        series,
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

static async cover(req, res, next) {
  const userId = req.user.user_id;
  const photoToBeDeleted = await AuthModel.findUserByAttribute(
    "user_id",
    userId
  );
  try {
    const storage = await StorageModel.getLoggedInStorage();
    const file = storage.find(photoToBeDeleted.cover_photo);
    await file.delete();
  } catch {
    console.log("easy man");
  }

  let data = {
    cover_photo: req.file?.filename || "not found",
  };
  try {
    const updateCover = await UserModel.updateUser(data, userId);
    if (updateCover.affectedRows)
      return res.status(STATUS_CODES.OK).json({
        status: "success",
        message: `cover has been updated successfully`,
      });
    return next(
      new AppError(`cover could not be updated`, STATUS_CODES.BAD_REQUEST)
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
static async photo(req, res, next) {
  const userId = req.user.user_id;
  const photoToBeDeleted = await AuthModel.findUserByAttribute(
    "user_id",
    userId
  );
  try {
    const storage = await StorageModel.getLoggedInStorage();
    const file = storage.find(photoToBeDeleted.photo);
    await file.delete();
  } catch {
    console.log("easy man");
  }

  let data = {
    photo: req.file?.filename || "not found",
  };
  try {
    const updatePhoto = await UserModel.updateUser(data, userId);
    if (updatePhoto.affectedRows)
      return res.status(STATUS_CODES.OK).json({
        status: "success",
        message: `profile photo has been updated successfully`,
      });
    return next(
      new AppError(
        `profile photo could not be updated`,
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

static async getPatientData(req, res, next) {
  const userId = req.params.id;
  const month=new Date().getMonth()+1;

    try {
      const [bgm, bgm2, bgm3] = await UserModel.getPatientData(userId, month);

      if (!bgm)
        return next(new AppError(`bgm are not exist`, STATUS_CODES.NOT_FOUND));
      res.status(STATUS_CODES.OK).json({
        status: "success",
        message: `successfully fetched bgm`,
        data: {
          bgm,
          bgm3,
          bgm2,
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

  static async getPatientList(req, res, next) {
    const userId = req.user.user_id;

    try {
      const [myPatient, freePatient] = await UserModel.getPatientList(userId);

      if (!freePatient)
        return next(
          new AppError(`freePatient are not exist`, STATUS_CODES.NOT_FOUND)
        );
      res.status(STATUS_CODES.OK).json({
        status: "success",
        message: `successfully fetched freePatient`,
        data: {
          freePatient,
          myPatient,
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

  static async getUserById(req, res, next) {
    const userId = req.user.user_id;

    try {
      const user = await UserModel.getUserById(userId);

      if (!user)
        return next(
          new AppError(
            `User with id ${userId} does not exist`,
            STATUS_CODES.NOT_FOUND
          )
        );

      if (user.user_id !== req.user.user_id) {
        return next(
          new AppError("You are not authorized", STATUS_CODES.FORBIDDEN)
        );
      }
      res.status(STATUS_CODES.OK).json({
        status: "success",
        message: `User with id ${userId} fetched successfully`,
        data: {
          user,
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

  static async updateUser(req, res, next) {
    const { body: requestBody } = req;

    const userId = req.user.user_id;

    try {
      const user = await AuthModel.findUserByAttribute("user_id", userId);

      if (!user)
        return next(
          new AppError(
            `User with id ${userId} does not exist`,
            STATUS_CODES.NOT_FOUND
          )
        );
      console.log(req.body);

      const updateUserResult = await UserModel.updateUser(requestBody, userId);

      if (updateUserResult.affectedRows)
        return res.status(STATUS_CODES.OK).json({
          status: "success",
          message: `User with id ${userId} updated successfully`,
          data: {
            user,
          },
        });

      return next(
        new AppError(
          `User with id ${userId} could not be updated`,
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
module.exports = UserController;
