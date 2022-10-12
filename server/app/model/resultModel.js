'user strict';
var sql = require('./db.js');

//Task object constructor
var Result = function(result){
    this.user_id = result.user_id;
    this.job_role = result.job_role;
    this.result = result.result;
    this.exam_date = result.exam_date;
    this.category = result.category;
};
Result.createResult = function (newResult, result) {    
    sql.query("INSERT INTO t_result set ?", newResult, function (err, res) {
            
            if(err) {
                console.log("error: ", err);
                result(err, {'created': false});
            }
            else{
                result(null, {'created': true});
            }
        });           
};

module.exports= Result;