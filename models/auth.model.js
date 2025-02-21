const jwt = require("jsonwebtoken");
const {Database}=require('../config/db.config')


class AuthModel {
  /**
   * @description
   * the following method creates and saves a new user into the database
   * @param {string} username the username of the user to be created
   * @param {string} password the hash password of the user to be created
   * @param {string} role the hash password of the user to be created
   * @returns the newly created user, if all ok
   */
  static async createUser(obj) {
    const query = 'INSERT INTO users SET ?';
    const params = obj;

    const result = await Database.executeQuery(query, params);

    return result;
  }
  static async fillPatient(first_name, last_name,number,
    email,photo,address,city,country,age,user_id) {
    const query = 'INSERT INTO patients SET ?';
    const params = {first_name, last_name,number,
        email,photo,address,city,country,age,user_id};

    const result = await Database.executeQuery(query, params);

    return result;
  }
  static async fillDoctor(first_name, last_name,number,
    email,photo,address,city,country,age,user_id) {
    const query = 'INSERT INTO doctors SET ?';
    const params = {first_name, last_name,number,
        email,photo,address,city,country,age,user_id};

    const result = await Database.executeQuery(query, params);

    return result;
  }
  static async fillPharmacies(name,number,
    email,photo,map_link,city,country,age,user_id) {
    const query = 'INSERT INTO patients SET ?';
    const params = {first_name, last_name,number,
        email,photo,address,city,user_id};

    const result = await Database.executeQuery(query, params);

    return result;
  }

  /**
   * @description
   * the following method fetches a user corresponding to a particular user attribute
   * @param {string} attribute the attribute for which the user is to be fetched
   * @param {any} value the value of the attribute
   * @returns the user, if exists
   */
  static async findUserByAttribute(attribute, value) {
    const params = [value];
    const query = `SELECT * FROM users WHERE ${attribute} = ?`;
    const result = await Database.executeQuery(query, params);
    return result[0]
  }
}
module.exports=AuthModel;