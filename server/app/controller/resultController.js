'use strict';

var Result = require('../model/resultModel.js');


exports.create_result = function(req, res) {
    var result = new Result(req.body);
    
    Result.createResult(result, function(err, user) {
        if (err)
            res.send(err);
        res.json(user);
    });
};
  