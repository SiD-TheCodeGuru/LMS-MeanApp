'user strict';
var sql = require('./db.js');

//Task object constructor
var Question = function(){
    // this.username = user.username;
    // this.password = user.password;
    // this.job_role = user.job_role;
};

Question.getQuestions = function(job_role, result) {
    const tableName = 't_questions_' + job_role.toLowerCase();
    sql.query("SELECT * from  " + tableName, function(err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        }
        else{
            result(null, res);
        }
    })
};


Question.getQuestionByCategory = function(job_role, category, result) {
    const tableName = 't_questions_' + job_role.toLowerCase();
    var count = 0;
    sql.query("SELECT question_total from t_result_evaluation", function (err, res) {
        if (err) {
            count = 20;
        } else {
            count = res[0].question_total;
        }
        sql.query("SELECT * from " + tableName + " WHERE category = ? ORDER BY RAND() LIMIT ?", [category, count], function (err1, res1) {
            if(err1) {
                console.log("error: ", err1);
                result(null, err1);
            }
            else{
                result(null, res1);
            }
        });
    });
    
}

Question.getRandomQuestions = function(job_role, result) {
    console.log(job_role);
    const tableName = 't_questions_' + job_role.toLowerCase();
    let count = 0;
    let category_count = 0;
    let question_per_category = 0;
    let extra_rows_to_fetch = 0;
    sql.query("SELECT question_total_all from t_result_evaluation", function (err, res) {
        if (err) {
            count = 50;
        } else {
            count = res[0].question_total_all;
        }
        sql.query("SELECT COUNT(DISTINCT category) as count FROM " + tableName, function(err1, res1) {
        
            if (err1) {
                category_count = 5;
            } else {
                category_count = res1[0].count;
            }
            question_per_category = Math.floor(count/category_count);
        
            if (question_per_category * category_count < count) {
                extra_rows_to_fetch = count - (question_per_category * category_count); 
            }

            console.log(extra_rows_to_fetch, count, question_per_category, category_count);
            sql.query("SELECT DISTINCT category from " + tableName, function(err2, res2) {
                if (err2) {
                    result(null, err2);
                } else {
                    if (res2.length) {
                        let finalQuestions = [];
                        res2.forEach((category, index) => {
                            if (index === category_count - 1 && extra_rows_to_fetch > 0) {
                                question_per_category = question_per_category + extra_rows_to_fetch;
                            }
                            sql.query("SELECT * from " + tableName + " WHERE category = ? ORDER BY RAND() LIMIT ?", [category.category, question_per_category], function(err3, res3){
                                console.log("SELECT * from " + tableName + " WHERE category = ? ORDER BY RAND() LIMIT ?", [category.category, question_per_category]);
                                
                                if (err3) {
                                    console.log('err3', err3);
                                } else {
                                    finalQuestions = [...finalQuestions, ...res3];
                                    if (index === category_count - 1){
                                        result(null, finalQuestions);
                                    } 
                                }
                            })
                        })
                    }
                }
            })
        });
    });    
}

Question.uploadQuestions = function(job_role, category, questions, result) {
    
    const tableName = 't_questions_' + job_role.toLowerCase();

    sql.query("DELETE from " + tableName + " WHERE category = ?", category, function(error) {
        if (error) {
            result(null, error);
        }
        const count = questions.length;
        questions.forEach((question, index) => {
            delete question.sl_no;
            question.category = category;
            sql.query("INSERT into "+ tableName +" set ?", question, function(err, res) {
                
                if(err) {
                    console.log(err);
                    result(err, {'created': false});
                }
                if (index === count - 1) {
                    result(null, {'created': true});
                }
            })
        });
    })

}


module.exports= Question;