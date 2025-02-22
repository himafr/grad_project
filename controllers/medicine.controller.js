const medsModel = require("../models/medicine.model.js");
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
const MedsModel = require("../models/medicine.model.js");
const StorageModel = require("../middlewares/mega.middleware.js");

class MedController {
  /**
   * @description
   * the controller method to fetch all meds for a particular user
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the array of meds for the user
   */
  static async getAllMeds(req, res, next) {
    try {
      let {query} = req;
      console.log(query)
      query.limit= query.limit||6;
      query.page= query.page||0;
      
      if(query.page<0)
        return next(new AppError("No medicine found", STATUS_CODES.NOT_FOUND));
      console.log(req.user)
      if(req.user.role == "pharmacy"){
        query.pharm_id =req.user.user_id;
     const    [meds,nums] = await medsModel.getAllPharmMeds(query);
         if (meds.length==0){return next(new AppError("No medicine found", STATUS_CODES.NOT_FOUND))};

         
       return res.status(STATUS_CODES.OK).json({
         status: "success",
         message: "All medicines fetched successfully",
         data: {
           meds,
           nums,
         },
       })
        }
        const  [meds,nums] = await medsModel.getAllMeds(query);
          if (meds.length==0){return next(new AppError("No medicine found", STATUS_CODES.NOT_FOUND))};

          console.log("working")
          
        res.status(STATUS_CODES.OK).json({
          status: "success",
          message: "All medicines fetched successfully",
          data: {
            meds,
            nums,
          },
        })
        
       
       
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
  static async createMed(req, res, next) {
    const { body: requestBody } = req;
    requestBody.med_photo = req.file?.filename||'not found';
    requestBody.pharm_id = req.user.user_id;
    try{
      requestBody.med_price=parseInt(requestBody.med_price)
    }catch{
      return next(new AppError("Invalid price format", STATUS_CODES.BAD_REQUEST))
    }
    try {
      const Result = await medsModel.createMed(requestBody);
      return res.status(STATUS_CODES.SUCCESSFULLY_CREATED).json({
        status: "success",
        message: "medicine added successfully",
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
  static async createComment(req, res, next) {
    const { body: requestBody } = req;
    const med_id=req.params.id;
    requestBody.med_id=med_id;
    requestBody.user_id=req.user.user_id;
    try {
      console.log(requestBody)
      const Result = await medsModel.createComment(requestBody);
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
    const med_id=req.params.id;
    requestBody.med_id=med_id;
    requestBody.user_id=req.user.user_id;
    try {
      const Result = await medsModel.createReview(requestBody);
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
   * the controller method to fetch the blog corresponding to a med id
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the med fetched from the database
   */
  static async getMedById(req, res, next) {
    const medId = req.params.id;

    try {
      const [med,review,comments] = await medsModel.getMedById(medId);

      if (!med)
        return next(
          new AppError(
            `medicine with id ${medId} not found`,
            STATUS_CODES.NOT_FOUND
          )
        );
      return res.status(STATUS_CODES.OK).json({
        status: "success",
        message: `medicine with id ${medId} fetched successfully`,
        data: {
          med,
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

  /**
   * @description
   * the controller method to update some attributes of a blog corresponding to an id
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   */
  static async updateMed(req, res, next) {
    const { body: requestBody } = req;
    const medId = req.params.id;
    delete requestBody.med_created_at;
    delete requestBody.med_photo;
    delete requestBody.med_id;
    delete requestBody.pharm_id;
    try {
      const medToBeUpdated1 = await medsModel.getMedById(medId);
      const medToBeUpdated=medToBeUpdated1[0];

      if (!medToBeUpdated)
        return next(
          new AppError(
            `medicine with id ${medId} not found`,
            STATUS_CODES.NOT_FOUND
          )
        );

      if (medToBeUpdated.pharm_id !== req.user.user_id)
        return next(
          new AppError("You are not authorized", STATUS_CODES.FORBIDDEN)
        );

      const updateMedResult = await medsModel.updateMed(requestBody, medId);
      if (updateMedResult.affectedRows)
        return res.status(STATUS_CODES.OK).json({
          status:"success",
          message: `medicine with id ${medId} updated successfully`,
        });
      return next(
        new AppError(
          `medicine with id ${medId} could not be updated`,
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
  static async deleteMed(req, res, next) {
    const medId = req.params.id;
    const medToBeDeleted1 = await medsModel.getMedById(medId);
    const medToBeDeleted =medToBeDeleted1[0]
    try{
      const storage= await StorageModel.getLoggedInStorage()
      const file = storage.find(medToBeDeleted.med_photo);
      await file.delete();
    }catch{
        console.log("easy man")
      }
    try {
      if (!medToBeDeleted)
        return next(
          new AppError(
            `medicine with id ${medId} not found`,
            STATUS_CODES.NOT_FOUND
          )
        );
      if (medToBeDeleted.pharm_id !== req.user.user_id)
        return next(
          new AppError("You are not authorized", STATUS_CODES.FORBIDDEN)
        );
      const deleteMedResult = await medsModel.deleteMed(medId);
      if (deleteMedResult.affectedRows)
        return res.status(STATUS_CODES.OK).json({
          status: "success",
          message: `medicine with id ${medId} deleted successfully`,
        });
      return next(
        new AppError(
          `medicine with id ${medId} could not be deleted`,
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
module.exports = MedController;