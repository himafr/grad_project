// different http status codes to be used as part of the response
exports.STATUS_CODES = {
  OK: 200,
  SUCCESSFULLY_CREATED: 201,
  REDIRECT: 302,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

// the mandatory fields during user auth
exports.userAuthRequiredFields = {
  USERNAME: 'username',
  PASSWORD: 'password'
};

// db error codes for error handling
exports.dbErrorCodes = {
  ER_DUP_ENTRY: 'ER_DUP_ENTRY'
};

// attribute for the cookie to be created to save the jwt token
exports.cookieAttributeForJwtToken = 'jwt_token';

exports.bookRequiredFields = {
  BOOK_TITLE: 'book_title',
}

exports.medicineRequiredFields = {
  MEDICINE_NAME: 'med_name',
  MED_PRICE: 'med_price'
}
exports.recipeRequiredFields = {
  RECIPE_NAME: 'recipe_name',
  INSTRUCTIONS: 'instructions',
  RECIPE_CARB: 'recipe_carb',
  INGREDIENTS: 'ingredients',

}
