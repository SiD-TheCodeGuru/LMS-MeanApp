'user strict';
var sql = require('./db.js');

//Task object constructor
var User = function(user){
    this.detail_id = user.detail_id;
    this.user_id = user.user_id;
    this.name = user.name;
    this.address = user.address;
    this.contact_no = user.contact_no;
    this.job_role = user.job_role;
    this.alt_contact_no = user.alt_contact_no;
    this.emer_contact_no = user.emer_contact_no;
    this.emp_id = user.emp_id;
    this.designation = user.designation;
    this.department = user.department;
    this.current_work_location = user.current_work_location;
    this.exp_in_elec = user.exp_in_elec;
    this.no_of_elec_work = user.no_of_elec_work;
    this.desig_in_elec = user.desig_in_elec;
    this.dob = user.dob;
    this.gender = user.gender;
    this.age = user.age;
    this.desig_cur_elec = user.desig_cur_elec;
    this.working_district = user.working_district;
    this.exp_in_elec_duty = user.exp_in_elec_duty;
    this.attnd_dur_elec = user.attnd_dur_elec;
    this.email = user.email;
    this.training_type = user.training_type;
};



const crypto = require('crypto');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

User.createUser = function (newUser, result) {    
    sql.query("INSERT INTO t_user_detail set ?", newUser, function (err, res) {
            
            if(err) {
                console.log("error: ", err);
                result(err, {'created': false});
            }
            else{
                console.log(res);
                sql.query("UPDATE t_user SET profile_check = ? WHERE id = ?", [1, newUser.user_id]);
                result(null, {'created': true});
            }
        });           
};

User.bulkCreate = function(users, result) {
    users.forEach((user) => {
        user.password = getHashedPassword(user.password);
        delete user.sl;
        sql.query("INSERT into t_user set ?", user, function(err, res) {
            if(err) {
                console.log("error: ", err);
                // result(err, null);
            }
            // else{
            //     console.log(res.insertId);
            //     result(null, res.insertId);
            // }
        })
    });
    result(null, null);
}

User.getUserById = function (userId, result) {
        // sql.query("Select username from t_user where id = ? ", userId, function (err, res) {   
        sql.query("Select ud.* from t_user_detail ud INNER JOIN t_user u ON ud.user_id = u.id where id = ? ", userId, function (err, res) {                
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else{
                    console.log(res);
                    result(null, res);
              
                }
            });   
};
User.getAllUser = function (result) {
        sql.query("Select ud.* from t_user_detail ud INNER JOIN t_user u ON ud.user_id = u.id", function (err, res) {

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
  sql.query("UPDATE t_user_detail SET " + 
                "name=?, " +
                "address=?, "+
                "contact_no=?, "+
                "job_role=?, "+
                "alt_contact_no=?, "+
                "emer_contact_no=?, "+
                "emp_id=?, "+
                "designation=?, "+
                "department=?, "+
                "current_work_location=?, "+
                "exp_in_elec=?, "+
                "no_of_elec_work=?, "+
                "desig_in_elec=?, "+
                "dob=?, "+
                "gender=?, "+
                "age=?, "+
                "desig_cur_elec=?, "+
                "working_district=?, "+
                "exp_in_elec_duty=?, "+
                "attnd_dur_elec=?, "+
                "email=?, "+
                "training_type=? "+
                "WHERE user_id = ?"
            , [
                user.name,
                user.address,
                user.contact_no,
                user.job_role,
                user.alt_contact_no,
                user.emer_contact_no,
                user.emp_id,
                user.designation,
                user.department,
                user.current_work_location,
                user.exp_in_elec,
                user.no_of_elec_work,
                user.desig_in_elec,
                user.dob,
                user.gender,
                user.age,
                user.desig_cur_elec,
                user.working_district,
                user.exp_in_elec_duty,
                user.attnd_dur_elec,
                user.email,
                user.training_type,
                parseInt(id)], function (err, res) {
          if(err) {
              console.log("error: ", err);
                result(null, err);
             }
           else{   
             result(null, {'created': true});
                }
            }); 
};
User.remove = function(id, result){
     sql.query("DELETE FROM t_user_detail WHERE user_id = ?", [id], function (err, res) {

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