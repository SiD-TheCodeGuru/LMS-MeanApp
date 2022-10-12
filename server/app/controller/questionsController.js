'use strict';

const { isFunctionExpression } = require('typescript');
var Question = require('../model/questionsModel.js');

exports.get_all_questions = function(req, res) {
    if (!req.params.job_role) {
        res.status(400).send({error: true, message: 'Please provide the job role param'});
    } else {
        Question.getQuestions(req.params.job_role, function(err, questions) {
            if (err) {
                res.send(err);
            }
            res.json(questions);
        });
    }   
};

exports.download_questions = function(req, res) {
    if (!req.params.job_role) {
        res.status(400).send({error: true, message: 'Please provide the job role param'});
    } else {
        Question.getQuestions(req.params.job_role, function(err, response) {
            
            if (err) {
                res.send(err);
            }
            
            const excel = require("exceljs");
            let questions = [];

            if (response.length) {
                response.forEach((question, index) => {
                    questions.push({
                        sl_no: index + 1,
                        job_role: question.job_role,
                        question: question.question,
                        option1: question.option1,
                        option2: question.option2,
                        option3: question.option3,
                        option4: question.option4,
                        option5: question.option5,
                        option6: question.option6,
                        option7: question.option7,
                        option8: question.option8,
                        batch: question.batch,
                        correct_option: question.correct_option,
                        category: question.category,
                    })
                })
            }

            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet(req.params.job_role + "_questions");


            worksheet.columns = [
                { header: "sl_no", key: "sl_no", width: 5 },
                { header: "job_role", key: "job_role", width: 25 },
                { header: "question", key: "question", width: 50 },
                { header: "option1", key: "option1", width: 10 },
                { header: "option2", key: "option2", width: 10 },
                { header: "option3", key: "option3", width: 10 },
                { header: "option4", key: "option4", width: 10 },
                { header: "option5", key: "option5", width: 10 },
                { header: "option6", key: "option6", width: 10 },
                { header: "option7", key: "option7", width: 10 },
                { header: "option8", key: "option8", width: 10 },
                { header: "batch", key: "batch", width: 10 },
                { header: "correct_option", key: "correct_option", width: 20 },
                { header: "category", key: "category", width: 10 },
              ];
          
              // Add Array Rows
              worksheet.addRows(questions);

              res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              );
              res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + req.params.job_role + "_questions.xlsx"
              );
          
              return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
              });
        });
    }
}

exports.get_questions_by_category = function(req, res) {
    if (!req.params.job_role) {
        res.status(400).send({error: true, message: 'Please provide the job role param'});
    } else if (!req.params.category){
        res.status(400).send({error: true, message: 'Please provide the question category param'});
    } else if (req.params.category.toLowerCase() === 'all') {
        Question.getRandomQuestions(req.params.job_role, function(err, questions) {
            // console.log('control', err, questions);
            if (err) {
                res.send(err);
            }
            res.json(questions);
        });
    } else {
        Question.getQuestionByCategory(req.params.job_role, req.params.category, function(err, questions) {
            if (err) {
                res.send(err);
            }
            res.json(questions);
        });
    }
}


exports.upload_questions = function(req, res) {
    if (!req.params.job_role) {
        res.status(400).send({error: true, message: 'Please provide the job role param'});
    } else if (!req.params.category) {
        res.status(400).send({error: true, message: 'Please provide the category param'});
    } else {
        // if(err){
        //     res.json({error_code:1, err_desc:err});
        //     return;
        // }
        /** Multer gives us file info in req.file object */
        if(!req.file){
            res.json({error_code:1, err_desc:"No file passed"});
            return;
        }
        /** Check the extension of the incoming file and
         *  use the appropriate module
         */
        var exceltojson;
        var xlstojson = require("xls-to-json-lc");
        var xlsxtojson = require("xlsx-to-json-lc");
        if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }
        try {
            exceltojson({
                input: req.file.path,
                output: null, //since we don't need output.json
                lowerCaseHeaders:true
            }, function(err,result){
                if(err) {
                    return res.json({error_code:1,err_desc:err, data: null});
                }

                Question.uploadQuestions(req.params.job_role, req.params.category, result, function(error, response) {
                    
                    if (err) {
                        res.send(error);
                    }
                    var fs = require('fs');
                    try {
                        fs.unlinkSync(req.file.path);
                    } catch(e) {
                        //error deleting the file
                    }
                    res.json(response);
                });
                
            });
        } catch (e){
            res.json({error_code:1,err_desc:"Corupted excel file"});
        }

    }   
}
