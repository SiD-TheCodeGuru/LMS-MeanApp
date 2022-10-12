'user strict';
var sql = require('./db.js');

//Task object constructor
var Report = function(req) {
    this.filters = {
        district: req.params.district,
        job_role: req.params.job_role,
        category: req.params.category
    }
};


Report.generateReport = function (filters, result) {  
    let clause = '';
    let notAssessesClause = '';
    let notAssessesWhereClause = '';
    let whereClause = '';
    if (filters) {
        if (filters.district && filters.district !== 'All') {
            clause += 'a.working_district = "' + filters.district + '"';
            notAssessesClause += 'working_district = "' + filters.district + '"';
        }
        if (filters.job_role && filters.job_role !== 'All') {
            if (clause.length) {
                clause += ' AND ';
                notAssessesClause += ' AND ';
            }
            clause += 'a.job_role = "' + filters.job_role + '"';
            notAssessesClause += 'job_role = "' + filters.job_role + '"';
        }
        if (filters.category && filters.category !== 'All') {
            if (clause.length) {
                clause += ' AND ';
            }
            clause += 'b.category = "' + filters.category + '"';
        }
        if (clause.length) {
            whereClause = ' WHERE ' + clause;
        }
        if (notAssessesClause.length) {
            notAssessesWhereClause = ' AND ' + notAssessesClause;
        }
    }
    sql.query(
        "SELECT DISTINCT user_id, job_role,category, name, contact_no, emer_contact_no, emp_id, designation, department, current_work_location, gender, working_district, email, result, exam_date" +
        " FROM (SELECT a.user_id, a.job_role, b.category, a.name, a.contact_no, a.emer_contact_no, a.emp_id, a.designation, a.department, a.current_work_location, a.gender, a.working_district, a.email, b.result, b.exam_date " +
        " FROM t_user_detail a INNER JOIN t_result b ON b.user_id = a.user_id " +
        whereClause + ") tmp", function (err, res) {
            
            if(err) {
                console.log("error: ", err);
                result(null, err);
            }
            else{
                sql.query("SELECT * from t_user_detail WHERE user_id NOT IN (SELECT user_id from t_result)" + notAssessesWhereClause, function(err1, res1) {
                    let reportData = {
                        assessed: res,
                        notAssessed: res1
                    };
                    result(null, reportData);
                })
            }
        });           
};

Report.generateDashboard = function(district, result) {
    let whereClauseResult = "SELECT DISTINCT user_id, job_role,category, name, emer_contact_no, emp_id, designation, department, current_work_location, gender, working_district, email, result, exam_date FROM (SELECT a.user_id, a.job_role, b.category, a.name, a.emer_contact_no, a.emp_id, a.designation, a.department, a.current_work_location, a.gender, a.working_district, a.email, b.result, b.exam_date FROM t_user_detail a INNER JOIN t_result b ON b.user_id = a.user_id) tmp";
    let whereClauseDetail = '';
    let whereClauseCondResult = "SELECT DISTINCT user_id, job_role,category, name, emer_contact_no, emp_id, designation, department, current_work_location, gender, working_district, email, result, exam_date FROM (SELECT a.user_id, a.job_role, b.category, a.name, a.emer_contact_no, a.emp_id, a.designation, a.department, a.current_work_location, a.gender, a.working_district, a.email, b.result, b.exam_date FROM t_user_detail a INNER JOIN t_result b ON b.user_id = a.user_id WHERE b.result='Satisfactory') tmp";
    let whereClauseCondDetail = '';
    let wherClauseUser = 'SELECT COUNT(*) as totalUser FROM t_user WHERE job_role <> "ADMIN" AND job_role <> "ADMINEO" AND id IN (SELECT user_id from t_user_detail)';
    let notTakenExam = "SELECT COUNT(*) as totalNotExam FROM t_user_detail WHERE user_id NOT IN (SELECT user_id FROM t_result)";
    if (district && district !== 'All') {
        whereClauseResult = 'SELECT DISTINCT user_id, job_role,category, name, emer_contact_no, emp_id, designation, department, current_work_location, gender, working_district, email, result, exam_date FROM (SELECT a.user_id, a.job_role, b.category, a.name, a.emer_contact_no, a.emp_id, a.designation, a.department, a.current_work_location, a.gender, a.working_district, a.email, b.result, b.exam_date FROM t_user_detail a INNER JOIN t_result b ON b.user_id = a.user_id WHERE a.working_district="' +  district + '") tmp';
        whereClauseCondResult = 'SELECT DISTINCT user_id, job_role,category, name, emer_contact_no, emp_id, designation, department, current_work_location, gender, working_district, email, result, exam_date FROM (SELECT a.user_id, a.job_role, b.category, a.name, a.emer_contact_no, a.emp_id, a.designation, a.department, a.current_work_location, a.gender, a.working_district, a.email, b.result, b.exam_date FROM t_user_detail a INNER JOIN t_result b ON b.user_id = a.user_id WHERE b.result="Satisfactory" AND a.working_district =  "' +  district + '") tmp';
        whereClauseDetail = ' WHERE working_district = "' + district + '"';
        whereClauseCondDetail = ' AND working_district = "' + district + '"';
        wherClauseUser = 'SELECT COUNT(*) as totalUser FROM t_user WHERE job_role <> "ADMIN" AND job_role <> "ADMINEO" AND id IN (SELECT user_id from t_user_detail WHERE working_district =  "' +  district + '")';
        notTakenExam = 'SELECT COUNT(*) as totalNotExam FROM t_user_detail WHERE working_district = "' + district + '" AND user_id NOT IN (SELECT user_id FROM t_result)';
    }
    var passQuery = whereClauseCondResult;
    var failQuery = "SELECT COUNT(*) as totalFail from t_result WHERE result = 'Need To Improve'";
    var districtQuery = "SELECT COUNT(DISTINCT working_district) as totalDistrict, COUNT(DISTINCT job_role) as totalRole, COUNT(DISTINCT department) as totalDept  from t_user_detail" + whereClauseDetail;
    var maleQuery = "SELECT COUNT(*) as totalMale from t_user_detail WHERE gender = 'male'" + whereClauseCondDetail;
    var femaleQuery = "SELECT COUNT(*) as totalFemale from t_user_detail WHERE gender = 'female'" + whereClauseCondDetail;
    var assessQuery = whereClauseResult;
    var userQuery = wherClauseUser;
    var dashboardData = {};    

    sql.query(passQuery, function(err1, res1) {
        if (err1) {
            console.log(err1);
            result(null, err1);
        }
        sql.query(failQuery, function(err2, res2) {
            if (err2) {
                console.log(err2);
                result(null, err2);
            }
            sql.query(districtQuery, function(err3, res3) {
                if (err3) {
                    console.log(err3);
                    result(null, err3);
                }
                sql.query(maleQuery, function(err4, res4) {
                    if (err4) {
                        console.log(err4);
                        result(err4);
                    }
                    sql.query(femaleQuery, function(err5, res5) {
                        if (err5) {
                            console.log(err5);
                            result(err5);
                        }
                        sql.query(assessQuery, function(err6, res6) {
                            if (err6) {
                                console.log(err6);
                                result(err6);
                            }
                            sql.query(userQuery, function(err7, res7) {
                                if (err7) {
                                    console.log(err7);
                                    result(err7)
                                }
                                sql.query(notTakenExam, function(err8, res8) {
                                    if (err8) {
                                        console.log(err8);
                                        result(err8)
                                    }
                                    dashboardData = {
                                        totalPass: res1.length,
                                        totalFail: res2[0].totalFail,
                                        totalDistrict: res3[0].totalDistrict,
                                        totalRole: res3[0].totalRole,
                                        totalDept: res3[0].totalDept,
                                        totalMale: res4[0].totalMale,
                                        totalFemale: res5[0].totalFemale,
                                        totalAssess: res6.length,
                                        totalUser: res7[0].totalUser,
                                        totalNotTakenExam: res8[0].totalNotExam
                                    }
                                    result(null, dashboardData);
                                })
                            })
                        })
                    })
                })
            })
        })
        // result(null, response);
    })
}

Report.generateDashboardByDistrict = function(exam_date, result) {
    if (exam_date) {
        var passQuery = 'SELECT count(*) as totalPass, working_district from (SELECT DISTINCT user_id, job_role,category, name, emer_contact_no, emp_id, designation, department, current_work_location, gender, working_district, email, result, exam_date FROM (SELECT a.user_id, a.job_role, b.category, a.name, a.emer_contact_no, a.emp_id, a.designation, a.department, a.current_work_location, a.gender, a.working_district, a.email, b.result, b.exam_date FROM t_user_detail a INNER JOIN t_result b ON b.user_id = a.user_id WHERE b.result="Satisfactory" AND b.exam_date ="' + exam_date + '") tmp) tmp GROUP BY working_district';
        var failQuery = 'SELECT count(*) as totalFail, working_district from (SELECT DISTINCT user_id, job_role,category, name, emer_contact_no, emp_id, designation, department, current_work_location, gender, working_district, email, result, exam_date FROM (SELECT a.user_id, a.job_role, b.category, a.name, a.emer_contact_no, a.emp_id, a.designation, a.department, a.current_work_location, a.gender, a.working_district, a.email, b.result, b.exam_date FROM t_user_detail a INNER JOIN t_result b ON b.user_id = a.user_id WHERE b.result="Need to Improve" AND b.exam_date ="' + exam_date + '") tmp) tmp GROUP BY working_district';
        var districtQuery = 'SELECT COUNT(DISTINCT department) as totalDept, working_district from t_user_detail WHERE user_id IN (SELECT user_id FROM t_result WHERE exam_date="' + exam_date + '") GROUP BY working_district';
        var roleQuery = 'SELECT COUNT(DISTINCT job_role) as totalRole, working_district from t_user_detail WHERE user_id IN (SELECT user_id FROM t_result WHERE exam_date="' + exam_date + '") GROUP BY working_district';
        var maleQuery = 'SELECT COUNT(DISTINCT user_id) as totalMale, working_district from t_user_detail WHERE gender = "male" AND user_id IN (SELECT user_id FROM t_result WHERE exam_date="' + exam_date + '") GROUP BY working_district';
        var femaleQuery = 'SELECT COUNT(DISTINCT user_id) as totalFemale, working_district from t_user_detail WHERE gender = "female" AND user_id IN (SELECT user_id FROM t_result WHERE exam_date="' + exam_date + '") GROUP BY working_district';
        var assessQuery = 'SELECT count(*) as totalAssess, working_district from (SELECT DISTINCT user_id, job_role,category, name, emer_contact_no, emp_id, designation, department, current_work_location, gender, working_district, email, result, exam_date FROM (SELECT a.user_id, a.job_role, b.category, a.name, a.emer_contact_no, a.emp_id, a.designation, a.department, a.current_work_location, a.gender, a.working_district, a.email, b.result, b.exam_date FROM t_user_detail a INNER JOIN t_result b ON b.user_id = a.user_id WHERE b.exam_date="' + exam_date +'") tmp) tmp GROUP BY working_district';
        var userQuery = 'SELECT count(DISTINCT user_id) as totalUser, working_district FROM `t_user_detail` WHERE job_role <> "ADMIN" AND job_role <> "ADMINEO" AND user_id IN (SELECT id FROM t_user WHERE job_role <> "ADMIN" AND job_role <> "ADMINEO" AND id IN (SELECT user_id from t_user_detail)) GROUP BY working_district';
        var notTakenExam = "SELECT COUNT(DISTINCT user_id) as totalNotExam, working_district FROM t_user_detail WHERE user_id NOT IN (SELECT user_id FROM t_result) GROUP BY working_district";
    } else {
        var passQuery = 'SELECT count(*) as totalPass, working_district from (SELECT DISTINCT user_id, job_role,category, name, emer_contact_no, emp_id, designation, department, current_work_location, gender, working_district, email, result, exam_date FROM (SELECT a.user_id, a.job_role, b.category, a.name, a.emer_contact_no, a.emp_id, a.designation, a.department, a.current_work_location, a.gender, a.working_district, a.email, b.result, b.exam_date FROM t_user_detail a INNER JOIN t_result b ON b.user_id = a.user_id WHERE b.result="Satisfactory") tmp) tmp GROUP BY working_district';
        var failQuery = 'SELECT count(*) as totalFail, working_district from (SELECT DISTINCT user_id, job_role,category, name, emer_contact_no, emp_id, designation, department, current_work_location, gender, working_district, email, result, exam_date FROM (SELECT a.user_id, a.job_role, b.category, a.name, a.emer_contact_no, a.emp_id, a.designation, a.department, a.current_work_location, a.gender, a.working_district, a.email, b.result, b.exam_date FROM t_user_detail a INNER JOIN t_result b ON b.user_id = a.user_id WHERE b.result="Need to Improve") tmp) tmp GROUP BY working_district';
        var districtQuery = 'SELECT COUNT(DISTINCT department) as totalDept, working_district from t_user_detail GROUP BY working_district';
        var roleQuery = 'SELECT COUNT(DISTINCT job_role) as totalRole, working_district from t_user_detail GROUP BY working_district';
        var maleQuery = 'SELECT COUNT(DISTINCT user_id) as totalMale, working_district from t_user_detail WHERE gender = "male" GROUP BY working_district';
        var femaleQuery = 'SELECT COUNT(DISTINCT user_id) as totalFemale, working_district from t_user_detail WHERE gender = "female" GROUP BY working_district';
        var assessQuery = 'SELECT count(*) as totalAssess, working_district from (SELECT DISTINCT user_id, job_role,category, name, emer_contact_no, emp_id, designation, department, current_work_location, gender, working_district, email, result, exam_date FROM (SELECT a.user_id, a.job_role, b.category, a.name, a.emer_contact_no, a.emp_id, a.designation, a.department, a.current_work_location, a.gender, a.working_district, a.email, b.result, b.exam_date FROM t_user_detail a INNER JOIN t_result b ON b.user_id = a.user_id) tmp) tmp GROUP BY working_district';
        var userQuery =  'SELECT count(DISTINCT user_id) as totalUser, working_district FROM `t_user_detail` WHERE job_role <> "ADMIN" AND job_role <> "ADMINEO" AND user_id IN (SELECT id FROM t_user WHERE job_role <> "ADMIN" AND job_role <> "ADMINEO" AND id IN (SELECT user_id from t_user_detail)) GROUP BY working_district';
        var notTakenExam = "SELECT COUNT(DISTINCT user_id) as totalNotExam, working_district  FROM t_user_detail WHERE user_id NOT IN (SELECT user_id FROM t_result) GROUP BY working_district";
    }
    let dashboardData = {}; 
    sql.query(passQuery, function(err1, res1) {
        if (err1) {
            console.log(err1);
            result(null, err1);
        }
        sql.query(failQuery, function(err2, res2) {
            if (err2) {
                console.log(err2);
                result(null, err2);
            }
            sql.query(districtQuery, function(err3, res3) {
                if (err3) {
                    console.log(err3);
                    result(null, err3);
                }
                sql.query(maleQuery, function(err4, res4) {
                    if (err4) {
                        console.log(err4);
                        result(err4);
                    }
                    sql.query(femaleQuery, function(err5, res5) {
                        if (err5) {
                            console.log(err5);
                            result(err5);
                        }
                        sql.query(assessQuery, function(err6, res6) {
                            if (err6) {
                                console.log(err6);
                                result(err6);
                            }
                            sql.query(userQuery, function(err7, res7) {
                                if (err7) {
                                    console.log(err7);
                                    result(err7)
                                }
                                sql.query(notTakenExam, function(err8, res8) {
                                    if (err8) {
                                        console.log(err8);
                                        result(err8)
                                    }
                                    sql.query(roleQuery, function(err9, res9) {
                                        if (err9) {
                                            console.log(err9);
                                            result(err9)
                                        }
                                        dashboardData = {
                                            totalPass: res1,
                                            totalFail: res2,
                                            districtQuery: res3,
                                            maleQuery: res4,
                                            femaleQuery: res5,
                                            assessQuery: res6,
                                            userQuery: res7,
                                            notTakenExam: res8,
                                            roleQuery: res9
                                        }
                                        result(null, dashboardData);
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })    
}

Report.formatDate = function() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    return [day, month, year].join('_');
}

module.exports= Report;