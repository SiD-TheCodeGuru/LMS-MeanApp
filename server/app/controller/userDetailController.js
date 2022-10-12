'use strict';

var User = require('../model/userDetailModel.js');

exports.list_all_users = function(req, res) {
  User.getAllUser(function(err, user) {
    if (err) {
      console.log('res', user);
      res.send(err);
    }
    res.send(user);
  });
};



exports.create_a_user = function(req, res) {
  var new_user = new User(req.body);

  //handles null error 
//    if(!new_user.name || !new_user.address){

//             res.status(400).send({ error:true, message: 'Please provide Name and Adress' });

//         }
// else{
  
  User.createUser(new_user, function(err, user) {
    
    if (err)
      res.send(err);
    res.json(user);
  });
//}
};

exports.bulk_create = function(req, res) {
  var users = req.body;

  if (!users.length) {
    res.status(400).send({error: true, message: 'Please provide users for create'});
  } else {
    User.bulkCreate(users, function(err, users) {
      if (err) {
        res.send(err);
      }
      res.json("Successfully created the users");
    });
  }
}


exports.read_a_user = function(req, res) {
  User.getUserById(req.params.userId, function(err, user) {
    if (err) {
      res.send(err);

    }
    res.json(user);
  });
};


exports.update_a_user = function(req, res) {
    console.log(req.params.userId, req.body, new User(req.body));
  User.updateById(req.params.userId, new User(req.body), function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};


exports.delete_a_user = function(req, res) {


  User.remove( req.params.userId, function(err, user) {
    if (err)
      res.send(err);
    res.json({ message: 'User successfully deleted' });
  });
};