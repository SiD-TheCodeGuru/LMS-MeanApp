'user strict';
var sql = require('./db.js');

//Task object constructor
var User = function(user){
    this.id = user.id;
    this.username = user.username;
    this.password = user.password;
    this.job_role = user.job_role;
};
User.createUser = function (newUser, result) {    
        sql.query("INSERT INTO t_user set ?", newUser, function (err, res) {
                
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else{
                    console.log(res.insertId);
                    result(null, res.insertId);
                }
            });           
};
User.getUserById = function (userId, result) {
        // sql.query("Select username from t_user where id = ? ", userId, function (err, res) {   
        sql.query("Select ud.* from t_user_detail ud INNER JOIN t_user u ON ud.user_id = u.id where id = ? ", userId, function (err, res) {                
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else{
                    result(null, res);
              
                }
            });   
};
User.getAllUser = function (result) {
        sql.query("Select * from t_user", function (err, res) {

                if(err) {
                    console.log("error: ", err);
                    result(null, err);
                }
                else{
                  console.log('users : ', res);  

                 result(null, res);
                }
            });   
};
User.updateById = function(id, user, result){
  sql.query("UPDATE t_user SET username = ? WHERE id = ?", [user.username, id], function (err, res) {
          if(err) {
              console.log("error: ", err);
                result(null, err);
             }
           else{   
             result(null, res);
                }
            }); 
};
User.remove = function(id, result){
     sql.query("DELETE FROM t_user WHERE id = ?", [id], function (err, res) {

                if(err) {
                    console.log("error: ", err);
                    result(null, err);
                }
                else{
               
                 result(null, res);
                }
            }); 
};

module.exports= User;