
const mysql= require( 'mysql');
// var mysql= require( 'mysql2');
// if(process.env.NODE_ENV === 'production'){
// mysql=mysql1;
// }
class DatabaseClass {
  constructor() {
    this.connection = undefined;
    this.config = {};
  }

  createConnection() {
    try{
      this.setConfig();
      this.connection = mysql.createConnection(this.config);
    }catch(err){
      console.log(err)
    }
  }

  getConnection() {
    if (!this.connection) this.createConnection();

    return this.connection;
  }

  setConfig() {
    // if(process.env.NODE_ENV === 'production'){
      this.config = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER, 
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
      }; 
      // }else{
        // this.config = {
        //   host: process.env.DB_HOST2,
        //   user: process.env.DB_USER2,
        //   password: process.env.DB_PASSWORD2,
        //   database: process.env.DB_NAME,
        //   port: process.env.DB_PORT2,
        // };
      // }
    
  }

  getConfig() {
    return this.setConfig();
  }

 
  executeQuery(queryString, params = []) {
    return new Promise((resolve, reject) => {
      this.getConnection().query(queryString, params, (error, result) => {
        if (error) {
          console.log('Error while connecting to database', error);
          reject(error);
        }
        resolve(result);
      });
    });
  }
}

exports.Database = new DatabaseClass();