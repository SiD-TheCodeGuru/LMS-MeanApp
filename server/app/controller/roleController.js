'use strict';

var Role = require('../model/roleModel.js');


exports.create_role = function(req, res) {
    var result = new Role(req.body);
    
    Role.createRole(result, function(err, result) {
        if (err)
            res.send(err);
        res.json(result);
    });
};


exports.list_all_roles = function(req, res) {
    Role.listRoles(function(err, roles) {
        
        if (err){
            res.send(err);
        }
        res.send(roles);
    });
}
  