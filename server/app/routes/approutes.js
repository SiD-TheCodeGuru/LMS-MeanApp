'use strict';
module.exports = function(app) {
  var todoList = require('../controller/appController');
  var user = require('../controller/userDetailController');
  var login = require('../controller/loginController');
  var question = require('../controller/questionsController');
  var result = require('../controller/resultController');
  var role = require('../controller/roleController');
  var report = require('../controller/reportController');
  const multer = require('multer');
  const readXlsxFile = require('read-excel-file/node');

  //-> Multer Upload Storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
  });
  
  const upload = multer({
    storage: storage,
    fileFilter : function(req, file, callback) { //file filter
      if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
          return callback(new Error('Wrong extension type.'));
      }
      callback(null, true);
  }
  });


  //login
  app.route('/login')
    .post(login.do_login);

  //login
  app.route('/examstatus')
    .post(login.check_examstatus);  

  // user Routes
  app.route('/user')
    .get(user.list_all_users)
    .post(user.create_a_user);
   
  app.route('/user/:userId')
    .get(user.read_a_user)
    .put(user.update_a_user)
    .delete(user.delete_a_user);

  app.route('/user/bulkCreate')  
    .post(user.bulk_create);

  app.route('/questions/:job_role')
    .get(question.get_all_questions);

  app.route('/questions/download/:job_role')
    .get(question.download_questions);

  app.route('/questions/:job_role/:category')
    .get(question.get_questions_by_category)
    .post(upload.single("file"), question.upload_questions);

  app.route('/result')
    .post(result.create_result);

  app.route('/role')
    .get(role.list_all_roles)
    .post(role.create_role);

  app.route('/report/:district/:job_role/:category')
    .get(report.generate_report);

  app.route('/dashboard/:district')
    .get(report.genrate_dashboard)
    .post(report.get_dashboard_by_district);

    
  // todoList Routes
  app.route('/tasks')
    .get(todoList.list_all_tasks)
    .post(todoList.create_a_task);
   
  app.route('/tasks/:taskId')
    .get(todoList.read_a_task)
    .put(todoList.update_a_task)
    .delete(todoList.delete_a_task);

    
};