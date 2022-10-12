'user strict';
var sql = require('./db.js');

//Task object constructor
var Login = function(user){
    
    this.username = user.username;
    this.password = user.password;
    this.job_role = user.job_role;
};

Login.doLogin = function(username, passwordHash, job_role, result) {
    /*sql.query("update `t_user` set password = ? where id = 2",passwordHash, function(err){
        if(err){
            console.log("Error: "+err);
        }
        else{
            console.log(username+ " " + passwordHash);
        }
    });*/
    sql.query("SELECT * from t_user WHERE username = ?", username, function (err, res) {
        
        if(err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            if (res.length) {
                if (res[0].password === passwordHash && res[0].job_role === job_role) {
                    sql.query("SELECT * from t_user_detail WHERE user_id = ?", res[0].id , function(error, resp) {
                        if (resp.length) {
                            delete resp[0].detail_id;
                             delete resp[0].user_id;
                        }
                        //console.log(...resp[0], ...res[0]);
                        const response = [{...resp[0], ...res[0]}];
                        result(null, response);
                    });
                } else {
                    result(null, []);
                }
            } else {
                result(null, res);
            }
        }
    }
    ); 
};

Login.checkExamstatus = function(user_id, category, result) {
    
    sql.query(
    "SELECT * FROM t_result WHERE user_id=" + user_id + " AND category='" + category + "' ", function (err, res) {
        
        if(err) {
            console.log("error: ", err);
            result(null, err);
        }
        else{
            result(null, res);
        }
    });       
};

module.exports= Login;