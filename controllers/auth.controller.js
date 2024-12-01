const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const {
  STATUS_CODES,
  cookieAttributeForJwtToken,
  dbErrorCodes,
  userAuthRequiredFields,
} =require ("../helpers/constants.js");
const {
  isAvailable,
  saveCookie,
  sendResponse,
  validate,
  passwordChangedAfter
} =require( "../helpers/utils.js");
const  AuthService  =require( "../services/auth.service.js");
const { findUserByAttribute } = require("../models/auth.model.js");

  /**
   * @description
   * the controller method to sign up a new user
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the newly created user
   */
  exports.registerUser = catchAsync(async (req, res, next) => {
    const { body: requestBody } = req;

    const allFieldsArePresent = isAvailable(
      requestBody,
      Object.values(userAuthRequiredFields)
    );

    if (!allFieldsArePresent)
      return next(
        new AppError("Some fields are missing", STATUS_CODES.BAD_REQUEST)
      );

    const { username, password } = requestBody;

    if (!validate.password(password))
      return next(
        new AppError(
          "Please use a different password",
          STATUS_CODES.BAD_REQUEST
        )
      );

    try {
      const {user,token:access_token}= await AuthService.signUpUser(requestBody);

      
      res.status(STATUS_CODES.SUCCESSFULLY_CREATED).json({status:"success", message:  "The user signed up successfully",
        token: access_token,
        data:{
          userId: user.id,
          username: user.username,
      }
      });
    } catch (error) {
      if (error.code === dbErrorCodes.ER_DUP_ENTRY) delete error.sql; // avoiding the sql query to prevent showcasing sensitive information in the response

      return next(
        new AppError(
          error.code === dbErrorCodes.ER_DUP_ENTRY
            ? "Username already exists"
            : error.message || "Internal Server Error",
          error.code === dbErrorCodes.ER_DUP_ENTRY
            ? STATUS_CODES.BAD_REQUEST
            : error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
          error.response || error
        )
      );
    }
  });

  /**
   * @description
   * the controller method to log in an existing user
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the information of the logged in user and the access token
   */
  exports.loginUser = catchAsync(async (req, res, next) => {
    const { body: requestBody } = req;

    const allFieldsArePresent = isAvailable(
      requestBody,
      Object.values(userAuthRequiredFields)
    );

    if (!allFieldsArePresent)
      return next(
        new AppError("Some fields are missing", STATUS_CODES.BAD_REQUEST)
      );

    const { username, password } = requestBody;

    try {
      const { user, token: access_token } = await AuthService.logInUser(
        username,
        password
      );

      saveCookie(res, cookieAttributeForJwtToken, access_token);

      res.status(STATUS_CODES.OK).json({status:"success", message: "User logged in successfully",
        token: access_token,
        data:{
          userId: user.id,
          username: user.username,
      }
      });
    } catch (error) {
      console.log(error)
      next(
        new AppError(
          error.message || "Internal Server Error",
          error.message === "Incorrect username" ||
          error.message === "Incorrect password"
            ? STATUS_CODES.BAD_REQUEST
            : error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
          error.response || error
        )
      );
    }
  });

  /**
   * @description
   * the controller method to log out a user
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   */
  exports.logOutUser=(req, res, next) =>{
    if (req.cookies[`${cookieAttributeForJwtToken}`]) {
      res.clearCookie(cookieAttributeForJwtToken);

      return res.status(STATUS_CODES.OK).json({status:"success",
        message: "User logged out successfully"});
    }

    return next(
      new AppError("You need to log in first", STATUS_CODES.BAD_REQUEST)
    );
  }

  exports.protect = catchAsync(async (req, res, next) => {
    // 1) getting token and check out if tis there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new AppError("you are not logged in", 401));
    }
    // 2) verification token
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //3) check if user still exist
    
    const freshUser = await findUserByAttribute('id',decode.userId);
    if (!freshUser) {
      return next(new AppError("user no longer exist", 401));
    }
    // 4) check if user changed password after the token was issued    
    if (passwordChangedAfter(decode.iat,freshUser.passwordChangedAt)) {
      return next(
        new AppError(
          "password has been changed from last time you logged in ",
          401
        )
      );
    }
    // grant  access to protected route
    delete freshUser.password
    delete freshUser.passwordChangedAt
    delete freshUser.created_at
    req.user = freshUser;
    next();
  });


  exports.restrictTo = (...value) => {
    return (req, res, next) => {
      if (!value.includes(req.user.role)) {
        return next(
          new AppError("you don't have permission to perform this action"),
          403
        );
      }
      next();
    };
  };
