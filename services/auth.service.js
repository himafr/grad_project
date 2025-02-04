const {
  getJwtToken,
  getHashPassword,
  verifyUserPassword,
} = require("../helpers/utils.js");
const AuthModel = require("../models/auth.model.js");

/**
 * @description
 * the service method to sign up a new user
 * @param {string} username the username of the user to be created
 * @param {string} password the plaintext password of the user to be created
 * @returns the newly created user
 */
exports.signUpUser = async (obj) => {
  const { username, password } = obj;
  const hashPassword = await getHashPassword(password);
  await AuthModel.createUser({...obj,password: hashPassword});
  const user = await AuthModel.findUserByAttribute("username", username);
  const jwtPayload = {
    userId: user.user_id,
    username: user.username,
  };

  const token = getJwtToken(jwtPayload);
  return { user, token };
};

/**
 * @description
 * the service method to log in an existing user
 * @param {string} username the username of the user
 * @param {string} password the plaintext password of the user
 * @returns the logged in user along with the access token
 */
exports.logInUser = async (username, password) => {
  const user = await AuthModel.findUserByAttribute("username", username);

  if (user) {
    const authCheck = await verifyUserPassword(password, user.password);

    if (authCheck) {
      console.log(user.first_name)
      const jwtPayload = {
        userId: user.user_id,
        username: user.username,
        role:user.role,
        first_name: user.first_name,
        photo: user.photo
      };

      const token = getJwtToken(jwtPayload);

      return { user, token };
    }
    throw Error("Incorrect password");
  }
  throw Error("Incorrect username");
};
