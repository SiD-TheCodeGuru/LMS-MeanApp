'user strict';
var sql = require('./db.js');

//Task object constructor
var Role = function(role){
    this.id = role.id;
    this.job_role = role.job_role;
};
Role.createRole = function (newRole, result) {    
    sql.query("INSERT INTO t_job_role set ?", newRole, function (err, res) {
            
            if(err) {
                console.log("error: ", err);
                result(err, {'created': false});
            }
            else{
                result(null, {'created': true});
            }
        });           
};

Role.listRoles = function (result) {    
    sql.query("SELECT * FROM t_job_role",  function (err, res) {
            
            if(err) {
                console.log("error: ", err);
                result(null, err);
            }
            else{
                result(null, res);
            }
        });           
};

module.exports= Role;