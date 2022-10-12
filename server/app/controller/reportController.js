'use strict';

var Report = require('../model/reportModel.js');

exports.generate_report = function(req, res) {
    var report = new Report(req);

    Report.generateReport(report.filters, function(err, response) {
        Report.generateDashboardByDistrict(null, function(error, responseAll) { 
            if (err){
                res.send(err);
            }
            const excel = require("exceljs");
            let reportAssessed = [];
            let reportNotAssessed = [];
            if (response.assessed.length) {
                response.assessed.forEach((result, index) => {
                    reportAssessed.push({
                        sl_no: index + 1,
                        name: result.name + ' ' + (result.emer_contact_no ? result.emer_contact_no : '') + ' ' + (result.emp_id ? result.emp_id : ''),
                        job_role: result.job_role,
                        designation: result.designation,
                        department: result.department,
                        contact_no: result.contact_no,
                        gender: result.gender,
                        district: result.working_district,
                        email: result.email,
                        category: result.category,
                        date: result.exam_date,
                        result: result.result,
                    })
                })
            }
    
            if (response.notAssessed.length) {
                response.notAssessed.forEach((result, index) => {
                    reportNotAssessed.push({
                        sl_no: index + 1,
                        name: result.name + ' ' + (result.emer_contact_no ? result.emer_contact_no : '') + ' ' + (result.emp_id ? result.emp_id : ''),
                        job_role: result.job_role,
                        designation: result.designation,
                        department: result.department,
                        contact_no: result.contact_no,
                        gender: result.gender,
                        district: result.working_district,
                        email: result.email
                    })
                })
            }
            
            let overallResponse, overallData = [];
            
            overallResponse = responseAll; 

            function getValue(type, district) {
                if(type === 'assessQuery') {
                  return (overallResponse.assessQuery.find(o => o.working_district === district)) ? (overallResponse.assessQuery.find(o => o.working_district === district)).totalAssess : 0;
                }
                if(type === 'userQuery') {
                  return (overallResponse.userQuery.find(o => o.working_district === district)) ? (overallResponse.userQuery.find(o => o.working_district === district)).totalUser : 0;
                }
                if(type === 'notTakenExam') {
                  return (overallResponse.notTakenExam.find(o => o.working_district === district)) ? (overallResponse.notTakenExam.find(o => o.working_district === district)).totalNotExam : 0;
                }
                if(type === 'actual') {
                  return (((overallResponse.userQuery.find(o => o.working_district === district)) ? (overallResponse.userQuery.find(o => o.working_district === district)).totalUser : 0) - ((overallResponse.notTakenExam.find(o => o.working_district === district)) ? (overallResponse.notTakenExam.find(o => o.working_district === district)).totalNotExam : 0));
                }
            }
    
            overallData = [
                { district: 'Karimganj Karimganj', total_assessments: getValue('assessQuery', 'Karimganj Karimganj'), total_registered: getValue('userQuery', 'Karimganj Karimganj'), registered_not_exam: getValue('notTakenExam', 'Karimganj Karimganj'), actual: getValue('actual', 'Karimganj Karimganj') },
                { district: 'Hailakandi Hailakandi', total_assessments: getValue('assessQuery', 'Hailakandi Hailakandi'), total_registered: getValue('userQuery', 'Hailakandi Hailakandi'), registered_not_exam: getValue('notTakenExam', 'Hailakandi Hailakandi'), actual: getValue('actual', 'Hailakandi Hailakandi') }, 
                { district: 'Cachar Silchar', total_assessments: getValue('assessQuery', 'Cachar Silchar'), total_registered: getValue('userQuery', 'Cachar Silchar'), registered_not_exam: getValue('notTakenExam', 'Cachar Silchar'), actual: getValue('actual', 'Cachar Silchar') }, 
                { district: 'Dima Hasao Haflong', total_assessments: getValue('assessQuery', 'Dima Hasao Haflong'), total_registered: getValue('userQuery', 'Dima Hasao Haflong'), registered_not_exam: getValue('notTakenExam', 'Dima Hasao Haflong'), actual: getValue('actual', 'Dima Hasao Haflong') }, 
                { district: 'Karbi Anglong Bokajan', total_assessments: getValue('assessQuery', 'Karbi Anglong Bokajan'), total_registered: getValue('userQuery', 'Karbi Anglong Bokajan'), registered_not_exam: getValue('notTakenExam', 'Karbi Anglong Bokajan'), actual: getValue('actual', 'Karbi Anglong Bokajan') }, 
                { district: 'Karbi Anglong Diphu', total_assessments: getValue('assessQuery', 'Karbi Anglong Diphu'), total_registered: getValue('userQuery', 'Karbi Anglong Diphu'), registered_not_exam: getValue('notTakenExam', 'Karbi Anglong Diphu'), actual: getValue('actual', 'Karbi Anglong Diphu') }, 
                { district: 'West Karbi Anglong Hamren', total_assessments: getValue('assessQuery', 'West Karbi Anglong Hamren'), total_registered: getValue('userQuery', 'West Karbi Anglong Hamren'), registered_not_exam: getValue('notTakenExam', 'West Karbi Anglong Hamren'), actual: getValue('actual', 'West Karbi Anglong Hamren') }, 
                { district: 'South Salamara Mankachar', total_assessments: getValue('assessQuery', 'South Salamara Mankachar'), total_registered: getValue('userQuery', 'South Salamara Mankachar'), registered_not_exam: getValue('notTakenExam', 'South Salamara Mankachar'), actual: getValue('actual', 'South Salamara Mankachar') }, 
                { district: 'Dhubri Dhubri', total_assessments: getValue('assessQuery', 'Dhubri Dhubri'), total_registered: getValue('userQuery', 'Dhubri Dhubri'), registered_not_exam: getValue('notTakenExam', 'Dhubri Dhubri'), actual: getValue('actual', 'Dhubri Dhubri') }, 
                { district: 'Dhubri Bilasipara', total_assessments: getValue('assessQuery', 'Dhubri Bilasipara'), total_registered: getValue('userQuery', 'Dhubri Bilasipara'), registered_not_exam: getValue('notTakenExam', 'Dhubri Bilasipara'), actual: getValue('actual', 'Dhubri Bilasipara') }, 
                { district: 'Kokrajhar Gossaigaon', total_assessments: getValue('assessQuery', 'Kokrajhar Gossaigaon'), total_registered: getValue('userQuery', 'Kokrajhar Gossaigaon'), registered_not_exam: getValue('notTakenExam', 'Kokrajhar Gossaigaon'), actual: getValue('actual', 'Kokrajhar Gossaigaon') }, 
                { district: 'Kokrajhar Kokrajhar', total_assessments: getValue('assessQuery', 'Kokrajhar Kokrajhar'), total_registered: getValue('userQuery', 'Kokrajhar Kokrajhar'), registered_not_exam: getValue('notTakenExam', 'Kokrajhar Kokrajhar'), actual: getValue('actual', 'Kokrajhar Kokrajhar') }, 
                { district: 'Chirang Chirang', total_assessments: getValue('assessQuery', 'Chirang Chirang'), total_registered: getValue('userQuery', 'Chirang Chirang'), registered_not_exam: getValue('notTakenExam', 'Chirang Chirang'), actual: getValue('actual', 'Chirang Chirang') }, 
                { district: 'Chirang Bijni', total_assessments: getValue('assessQuery', 'Chirang Bijni'), total_registered: getValue('userQuery', 'Chirang Bijni'), registered_not_exam: getValue('notTakenExam', 'Chirang Bijni'), actual: getValue('actual', 'Chirang Bijni') }, 
                { district: 'Bongaigaon Bongaigaon', total_assessments: getValue('assessQuery', 'Bongaigaon Bongaigaon'), total_registered: getValue('userQuery', 'Bongaigaon Bongaigaon'), registered_not_exam: getValue('notTakenExam', 'Bongaigaon Bongaigaon'), actual: getValue('actual', 'Bongaigaon Bongaigaon') }, 
                { district: 'Bongaigaon North Salmara', total_assessments: getValue('assessQuery', 'Bongaigaon North Salmara'), total_registered: getValue('userQuery', 'Bongaigaon North Salmara'), registered_not_exam: getValue('notTakenExam', 'Bongaigaon North Salmara'), actual: getValue('actual', 'Bongaigaon North Salmara') }, 
                { district: 'Goalpara Goalpara', total_assessments: getValue('assessQuery', 'Goalpara Goalpara'), total_registered: getValue('userQuery', 'Goalpara Goalpara'), registered_not_exam: getValue('notTakenExam', 'Goalpara Goalpara'), actual: getValue('actual', 'Goalpara Goalpara') }, 
                { district: 'Barpeta Barpeta', total_assessments: getValue('assessQuery', 'Barpeta Barpeta'), total_registered: getValue('userQuery', 'Barpeta Barpeta'), registered_not_exam: getValue('notTakenExam', 'Barpeta Barpeta'), actual: getValue('actual', 'Barpeta Barpeta') }, 
                { district: 'Barpeta Bajali', total_assessments: getValue('assessQuery', 'Barpeta Bajali'), total_registered: getValue('userQuery', 'Barpeta Bajali'), registered_not_exam: getValue('notTakenExam', 'Barpeta Bajali'), actual: getValue('actual', 'Barpeta Bajali') }, 
                { district: 'Kamrup Guwahati', total_assessments: getValue('assessQuery', 'Kamrup Guwahati'), total_registered: getValue('userQuery', 'Kamrup Guwahati'), registered_not_exam: getValue('notTakenExam', 'Kamrup Guwahati'), actual: getValue('actual', 'Kamrup Guwahati') }, 
                { district: 'Kamrup Rangia', total_assessments: getValue('assessQuery', 'Kamrup Rangia'), total_registered: getValue('userQuery', 'Kamrup Rangia'), registered_not_exam: getValue('notTakenExam', 'Kamrup Rangia'), actual: getValue('actual', 'Kamrup Rangia') }, 
                { district: 'Kamrup Metro Guwahati (Sadar)', total_assessments: getValue('assessQuery', 'Kamrup Metro Guwahati (Sadar)'), total_registered: getValue('userQuery', 'Kamrup Metro Guwahati (Sadar)'), registered_not_exam: getValue('notTakenExam', 'Kamrup Metro Guwahati (Sadar)'), actual: getValue('actual', 'Kamrup Metro Guwahati (Sadar)') }, 
                { district: 'Nalbari Nalbari', total_assessments: getValue('assessQuery', 'Nalbari Nalbari'), total_registered: getValue('userQuery', 'Nalbari Nalbari'), registered_not_exam: getValue('notTakenExam', 'Nalbari Nalbari'), actual: getValue('actual', 'Nalbari Nalbari') }, 
                { district: 'Baksa Baksa', total_assessments: getValue('assessQuery', 'Baksa Baksa'), total_registered: getValue('userQuery', 'Baksa Baksa'), registered_not_exam: getValue('notTakenExam', 'Baksa Baksa'), actual: getValue('actual', 'Baksa Baksa') }, 
                { district: 'Udalguri Udalguri', total_assessments: getValue('assessQuery', 'Udalguri Udalguri'), total_registered: getValue('userQuery', 'Udalguri Udalguri'), registered_not_exam: getValue('notTakenExam', 'Udalguri Udalguri'), actual: getValue('actual', 'Udalguri Udalguri') }, 
                { district: 'Darrang Mangaldoi', total_assessments: getValue('assessQuery', 'Darrang Mangaldoi'), total_registered: getValue('userQuery', 'Darrang Mangaldoi'), registered_not_exam: getValue('notTakenExam', 'Darrang Mangaldoi'), actual: getValue('actual', 'Darrang Mangaldoi') }, 
                { district: 'Sonitpur Tezpur', total_assessments: getValue('assessQuery', 'Sonitpur Tezpur'), total_registered: getValue('userQuery', 'Sonitpur Tezpur'), registered_not_exam: getValue('notTakenExam', 'Sonitpur Tezpur'), actual: getValue('actual', 'Sonitpur Tezpur') }, 
                { district: 'Biswanath Biswanath Chariali', total_assessments: getValue('assessQuery', 'Biswanath Biswanath Chariali'), total_registered: getValue('userQuery', 'Biswanath Biswanath Chariali'), registered_not_exam: getValue('notTakenExam', 'Biswanath Biswanath Chariali'), actual: getValue('actual', 'Biswanath Biswanath Chariali') }, 
                { district: 'Biswanath Gohpur', total_assessments: getValue('assessQuery', 'Biswanath Gohpur'), total_registered: getValue('userQuery', 'Biswanath Gohpur'), registered_not_exam: getValue('notTakenExam', 'Biswanath Gohpur'), actual: getValue('actual', 'Biswanath Gohpur') }, 
                { district: 'Morigaon Morigaon', total_assessments: getValue('assessQuery', 'Morigaon Morigaon'), total_registered: getValue('userQuery', 'Morigaon Morigaon'), registered_not_exam: getValue('notTakenExam', 'Morigaon Morigaon'), actual: getValue('actual', 'Morigaon Morigaon') }, 
                { district: 'Nagaon Nagaon', total_assessments: getValue('assessQuery', 'Nagaon Nagaon'), total_registered: getValue('userQuery', 'Nagaon Nagaon'), registered_not_exam: getValue('notTakenExam', 'Nagaon Nagaon'), actual: getValue('actual', 'Nagaon Nagaon') },
                { district: 'Nagaon Kaliabor', total_assessments: getValue('assessQuery', 'Nagaon Kaliabor'), total_registered: getValue('userQuery', 'Nagaon Kaliabor'), registered_not_exam: getValue('notTakenExam', 'Nagaon Kaliabor'), actual: getValue('actual', 'Nagaon Kaliabor') },
                { district: 'Hojai Hojai', total_assessments: getValue('assessQuery', 'Hojai Hojai'), total_registered: getValue('userQuery', 'Hojai Hojai'), registered_not_exam: getValue('notTakenExam', 'Hojai Hojai'), actual: getValue('actual', 'Hojai Hojai') },
                { district: 'Golaghat Bokakhat', total_assessments: getValue('assessQuery', 'Golaghat Bokakhat'), total_registered: getValue('userQuery', 'Golaghat Bokakhat'), registered_not_exam: getValue('notTakenExam', 'Golaghat Bokakhat'), actual: getValue('actual', 'Golaghat Bokakhat') },
                { district: 'Golaghat Dhansiri', total_assessments: getValue('assessQuery', 'Golaghat Dhansiri'), total_registered: getValue('userQuery', 'Golaghat Dhansiri'), registered_not_exam: getValue('notTakenExam', 'Golaghat Dhansiri'), actual: getValue('actual', 'Golaghat Dhansiri') },
                { district: 'Golaghat Golaghat', total_assessments: getValue('assessQuery', 'Golaghat Golaghat'), total_registered: getValue('userQuery', 'Golaghat Golaghat'), registered_not_exam: getValue('notTakenExam', 'Golaghat Golaghat'), actual: getValue('actual', 'Golaghat Golaghat') },
                { district: 'Jorhat Jorhat', total_assessments: getValue('assessQuery', 'Jorhat Jorhat'), total_registered: getValue('userQuery', 'Jorhat Jorhat'), registered_not_exam: getValue('notTakenExam', 'Jorhat Jorhat'), actual: getValue('actual', 'Jorhat Jorhat') },
                { district: 'Jorhat Titabor', total_assessments: getValue('assessQuery', 'Jorhat Titabor'), total_registered: getValue('userQuery', 'Jorhat Titabor'), registered_not_exam: getValue('notTakenExam', 'Jorhat Titabor'), actual: getValue('actual', 'Jorhat Titabor') },
                { district: 'Majuli Majuli', total_assessments: getValue('assessQuery', 'Majuli Majuli'), total_registered: getValue('userQuery', 'Majuli Majuli'), registered_not_exam: getValue('notTakenExam', 'Majuli Majuli'), actual: getValue('actual', 'Majuli Majuli') },
                { district: 'Sivasagar Sivasagar', total_assessments: getValue('assessQuery', 'Sivasagar Sivasagar'), total_registered: getValue('userQuery', 'Sivasagar Sivasagar'), registered_not_exam: getValue('notTakenExam', 'Sivasagar Sivasagar'), actual: getValue('actual', 'Sivasagar Sivasagar') },
                { district: 'Sivasagar Nazira', total_assessments: getValue('assessQuery', 'Sivasagar Nazira'), total_registered: getValue('userQuery', 'Sivasagar Nazira'), registered_not_exam: getValue('notTakenExam', 'Sivasagar Nazira'), actual: getValue('actual', 'Sivasagar Nazira') }, 
                { district: 'Charaideo Sonari', total_assessments: getValue('assessQuery', 'Charaideo Sonari'), total_registered: getValue('userQuery', 'Charaideo Sonari'), registered_not_exam: getValue('notTakenExam', 'Charaideo Sonari'), actual: getValue('actual', 'Charaideo Sonari') }, 
                { district: 'Lakhimpur Lakhimpur', total_assessments: getValue('assessQuery', 'Lakhimpur Lakhimpur'), total_registered: getValue('userQuery', 'Lakhimpur Lakhimpur'), registered_not_exam: getValue('notTakenExam', 'Lakhimpur Lakhimpur'), actual: getValue('actual', 'Lakhimpur Lakhimpur') }, 
                { district: 'Lakhimpur Dhakuakhana', total_assessments: getValue('assessQuery', 'Lakhimpur Dhakuakhana'), total_registered: getValue('userQuery', 'Lakhimpur Dhakuakhana'), registered_not_exam: getValue('notTakenExam', 'Lakhimpur Dhakuakhana'), actual: getValue('actual', 'Lakhimpur Dhakuakhana') }, 
                { district: 'Dhemaji Dhemaji', total_assessments: getValue('assessQuery', 'Dhemaji Dhemaji'), total_registered: getValue('userQuery', 'Dhemaji Dhemaji'), registered_not_exam: getValue('notTakenExam', 'Dhemaji Dhemaji'), actual: getValue('actual', 'Dhemaji Dhemaji') }, 
                { district: 'Dhemaji Jonai', total_assessments: getValue('assessQuery', 'Dhemaji Jonai'), total_registered: getValue('userQuery', 'Dhemaji Jonai'), registered_not_exam: getValue('notTakenExam', 'Dhemaji Jonai'), actual: getValue('actual', 'Dhemaji Jonai') }, 
                { district: 'Dibrugarh Dibrugarh', total_assessments: getValue('assessQuery', 'Dibrugarh Dibrugarh'), total_registered: getValue('userQuery', 'Dibrugarh Dibrugarh'), registered_not_exam: getValue('notTakenExam', 'Dibrugarh Dibrugarh'), actual: getValue('actual', 'Dibrugarh Dibrugarh') }, 
                { district: 'Tinsukia Tinsukia', total_assessments: getValue('assessQuery', 'Tinsukia Tinsukia'), total_registered: getValue('userQuery', 'Tinsukia Tinsukia'), registered_not_exam: getValue('notTakenExam', 'Tinsukia Tinsukia'), actual: getValue('actual', 'Tinsukia Tinsukia') }, 
                { district: 'Tinsukia Margherita', total_assessments: getValue('assessQuery', 'Tinsukia Margherita'), total_registered: getValue('userQuery', 'Tinsukia Margherita'), registered_not_exam: getValue('notTakenExam', 'Tinsukia Margherita'), actual: getValue('actual', 'Tinsukia Margherita') }, 
                { district: 'Tinsukia Sadiya', total_assessments: getValue('assessQuery', 'Tinsukia Sadiya'), total_registered: getValue('userQuery', 'Tinsukia Sadiya'), registered_not_exam: getValue('notTakenExam', 'Tinsukia Sadiya'), actual: getValue('actual', 'Tinsukia Sadiya') }, 
            ];

            let workbook = new excel.Workbook();
            let worksheetAppeared = workbook.addWorksheet("Registered and taken test");
            let worksheetNotAppeared = workbook.addWorksheet("Registered and not taken test");
            let worksheetOverall = workbook.addWorksheet("Overall performance");


            worksheetAppeared.columns = [
                { header: "sl_no", key: "sl_no", width: 5 },
                { header: "Name", key: "name", width: 35 },
                { header: "Job Role", key: "job_role", width: 30 },
                { header: "Designation", key: "designation", width: 30 },
                { header: "Department", key: "department", width: 30 },
                { header: "Contact No", key: "contact_no", width: 20 },
                { header: "Gender", key: "gender", width: 20 },
                { header: "District", key: "district", width: 30 },
                { header: "EMail", key: "email", width: 35 },
                { header: "Exam Category", key: "category", width: 20 },
                { header: "Exam Date", key: "date", width: 20 },
                { header: "Result", key: "result", width: 20 },
            ];

            worksheetNotAppeared.columns = [
                { header: "sl_no", key: "sl_no", width: 5 },
                { header: "Name", key: "name", width: 35 },
                { header: "Job Role", key: "job_role", width: 30 },
                { header: "Designation", key: "designation", width: 30 },
                { header: "Department", key: "department", width: 30 },
                { header: "Contact No", key: "contact_no", width: 20 },
                { header: "Gender", key: "gender", width: 20 },
                { header: "District", key: "district", width: 30 },
                { header: "EMail", key: "email", width: 235 }
            ];

            worksheetOverall.columns = [
                { header: "District", key: "district", width: 30 },
                { header: "Total Assessments", key: "total_assessments", width: 17 },
                { header: "Total Registered", key: "total_registered", width: 15 },
                { header: "Total Registered & not taken test", key: "registered_not_exam", width: 30 },
                { header: "Total Actually Assessed (C - D)", key: "actual", width: 27 }
            ];
        
            // Add Array Rows
            worksheetAppeared.addRows(reportAssessed);
            worksheetNotAppeared.addRows(reportNotAssessed);
            worksheetOverall.addRows(overallData);

            res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
            "Content-Disposition",
            "attachment; filename=assametap_report_" + Report.formatDate() + '_' +  req.params.district + ".xlsx"
            );
        
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        });
    });
};

exports.genrate_dashboard = function(req, res) {
    const district = req.params.district;
    Report.generateDashboard(district, function(error, response) {
        if(error) {
            res.send(error);
        }
        res.json(response);
    })
}

exports.get_dashboard_by_district = function(req, res) {
    var exam_date = req.body.exam_date;
    Report.generateDashboardByDistrict(exam_date, function(error, response) {
        if (error) {
            res.send(error);
        }
        res.json(response);
    })
}