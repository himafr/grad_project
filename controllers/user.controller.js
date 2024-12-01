// const User= require('../models/user.model')
const catchAsync=require('../utils/catchAsync')

exports.getAllUsers=catchAsync(async(req,res)=>{
    const users= await User.find()
 res.status(500).json({
     status: "success",
     message: {
        users
     }
 })
})
exports.createUser=(req,res)=>{
 res.status(500).json({
     status: "error",
     message: "This route is not yet defined"
 })
}
exports.findUser=(req,res)=>{
 res.status(500).json({
     status: "error",
     message: "This route is not yet defined"
 })
}
exports.deleteUser=(req,res)=>{
 res.status(500).json({
     status: "error",
     message: "This route is not yet defined"
 })
}
exports.updateUser=(req,res)=>{
 res.status(500).json({
     status: "error",
     message: "This route is not yet defined"
 })
}

 
    /**
     * @description
     * the controller method to fetch a user corresponding to an id
     * @param {object} req the request object
     * @param {object} res the response object
     * @param {object} next the next middleware function in the application’s request-response cycle
     * @returns the user fetched from the database
     */
    // static async getUserById(req, res, next) {
    //   const userId = req.params.id;
  
    //   try {
    //     const user = await AuthModel.findUserByAttribute("id", userId);
  
    //     if (!user)
    //       return next(
    //         new AppError(
    //           `User with id ${userId} does not exist`,
    //           STATUS_CODES.NOT_FOUND
    //         )
    //       );
  
    //     if (user.id !== res.locals.user.id)
    //       return next(
    //         new AppError("You are not authorized", STATUS_CODES.FORBIDDEN)
    //       );
  
    //     return sendResponse(
    //       res,
    //       STATUS_CODES.OK,
    //       `User with id ${userId} fetched successfully`,
    //       {
    //         id: user.id,
    //         username: user.username,
    //       }
    //     );
    //   } catch (error) {
    //     return next(
    //       new AppError(
    //         error.message || "Internal Server Error",
    //         error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
    //         error.response || error
    //       )
    //     );
    //   }
    // }
  
    /**
     * @description
     * the controller method to update some attributes of a user corresponding to an id
     * @param {object} req the request object
     * @param {object} res the response object
     * @param {object} next the next middleware function in the application’s request-response cycle
     */
    // static async updateUser(req, res, next) {
    //   const { body: requestBody } = req;
  
    //   const fieldsToBeUpdatedExist = isAvailable(
    //     requestBody,
    //     Object.values(userUpdateFields),
    //     false
    //   );
  
    //   if (!fieldsToBeUpdatedExist)
    //     return next(
    //       new AppError(
    //         "Fields to be updated does not exist",
    //         STATUS_CODES.BAD_REQUEST
    //       )
    //     );
  
    //   const userId = req.params.id;
  
    //   try {
    //     const user = await AuthModel.findUserByAttribute("id", userId);
  
    //     if (!user)
    //       return next(
    //         new AppError(
    //           `User with id ${userId} does not exist`,
    //           STATUS_CODES.NOT_FOUND
    //         )
    //       );
  
    //     if (user.id !== res.locals.user.id)
    //       return next(
    //         new AppError("You are not authorized", STATUS_CODES.FORBIDDEN)
    //       );
  
    //     const updateUserResult = await BooksModel.updateUser(requestBody, userId);
  
    //     if (updateUserResult.affectedRows)
    //       return sendResponse(
    //         res,
    //         STATUS_CODES.OK,
    //         `User with id ${userId} updated successfully`
    //       );
    //     return next(
    //       new AppError(
    //         `User with id ${userId} could not be updated`,
    //         STATUS_CODES.BAD_REQUEST
    //       )
    //     );
    //   } catch (error) {
    //     return next(
    //       new AppError(
    //         error.message || "Internal Server Error",
    //         error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
    //         error.response || error
    //       )
    //     );
    //   }
    // }
  
    /**
     * @description
     * the controller method to delete a user corresponding to an id
     * @param {object} req the request object
     * @param {object} res the response object
     * @param {object} next the next middleware function in the application’s request-response cycle
     */
    // static async deleteUser(req, res, next) {
    //   const userId = req.params.id;
  
    //   try {
    //     const user = await AuthModel.findUserByAttribute("id", userId);
  
    //     if (!user)
    //       return next(
    //         new AppError(
    //           `User with id ${userId} does not exist`,
    //           STATUS_CODES.NOT_FOUND
    //         )
    //       );
  
    //     if (user.id !== res.locals.user.id)
    //       return next(
    //         new AppError("You are not authorized", STATUS_CODES.FORBIDDEN)
    //       );
  
    //     const deleteUserResult = await BooksModel.deleteUser(userId);
  
    //     if (deleteUserResult.affectedRows) {
    //       res.clearCookie(cookieAttributeForJwtToken); // on deleting the user, the auth token must be deleted from cookie as well
    //       return sendResponse(
    //         res,
    //         STATUS_CODES.OK,
    //         `User with id ${userId} deleted successfully`
    //       );
    //     }
    //     return next(
    //       new AppError(
    //         `User with id ${userId} could not be deleted`,
    //         STATUS_CODES.BAD_REQUEST
    //       )
    //     );
    //   } catch (error) {
    //     return next(
    //       new AppError(
    //         error.message || "Internal Server Error",
    //         error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
    //         error.response || error
    //       )
    //     );
    //   }
    // }