import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WarningComponent } from '../warning/warning.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { UrlListService } from '../services/url-list.service';
@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss', '../../app.component.scss']
})
export class ExamComponent implements OnInit {
  requiredPercentage = 30;
  userinfo: any;
  resultText: any;
  progressBar = false;
  questionList = [];
  displayName = '';
  category = '';
  constructor(private router: Router, public dialog: MatDialog, private http: HttpClient, private urlListService: UrlListService) {}
  ngOnInit() {
    var quest = JSON.parse(localStorage.getItem('aeci-question'));
    if(quest === null) {
      this.router.navigate(['/exam']);
    }
    if(quest) {
      this.userinfo = JSON.parse(localStorage.getItem('aeci-userifo'));
      this.displayName = this.userinfo.name;
      var temp = JSON.parse(localStorage.getItem('aeci-question'));
      this.questionList = temp.value;
      this.category = localStorage.getItem('aeci-category');
    }
  }

  submitTest() {
    var checkAll = this.checkAllAnswered(this.questionList);
    if(checkAll) {
      var evaluationList = this.getCorrectWrongAnswer(this.questionList);
      var percentage = Math.round((evaluationList.correct.length / this.questionList.length ) * 100);
      if(percentage >= this.requiredPercentage) {
        localStorage.setItem('aeci-tsc', 'passed');
        this.resultText = 'Satisfactory';
      } else {
        localStorage.setItem('aeci-tsc', 'failed');
        this.resultText = 'Need to Improve';
      }
      this.getWarningMessage('Confirmation', 'Are you sure want to submit your answers? Once submitted, you will not be able to modify it.', 'exam');
    } else {
      this.getWarningMessage('Pending Questions', 'You have not answered all questions. Please answer all the question.', 'pendingexam');
    }
  }

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

  saveResultInfo() {
    var tempDate = new Date();
    var data = {
      user_id: this.userinfo.id,
      job_role: this.userinfo.job_role,
      result: this.resultText,
      exam_date: this.formatDate(tempDate),
      category: this.category
    };

    this.progressBar = true;
    let response: any;
    this.http.post(this.urlListService.urls.saveExam, data)
    .subscribe(event => {
        response = event;
        this.progressBar = false;
        if(response.created) {
          localStorage.removeItem('aeci-question');
          this.router.navigate(['/result']);
        }
      },
      errorMessage => {
        console.log('errorMessage', errorMessage);
        this.progressBar = false;
      }
    );
  }

  getWarningMessage(subject, message, type) {
    const dialogRef = this.dialog.open(WarningComponent, {
      disableClose: true,
      width: '400px',
      panelClass: 'warning-wrapper',
      data: {'subject': subject, 'message': message, 'type': type}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        if(result === 'submit') {
          this.saveResultInfo();
        }
      }
    });
  }

  checkAllAnswered(questions) {
    var counter = 0;
    for(var i=0; i<questions.length; i++) {
      if(questions[i].answer) {
        counter += 1;
      }
    }
    return (counter > 10) ? true : false;
    //return true;
  }

  getCorrectWrongAnswer(questions) {
    var temp = { correct: [], wrong: [] };
    for(var i=0; i<questions.length; i++) {
      if(questions[i].answer) {
        if(questions[i].answer === questions[i].correct_option) {
          temp.correct.push(questions[i]);
        } else {
          temp.wrong.push(questions[i]);
        }
      } else {
        temp.wrong.push(questions[i]);
      }
    }
    return temp;
  }

  goto(item) {
    if(item === 'facebook') {
      window.open("https://www.facebook.com/ceoTripura");
    }
    if(item === 'twitter') {
      window.open("https://twitter.com/ceo_Tripura");
    }
    if(item === 'youtube') {
      window.open("https://www.youtube.com/results?search_query=ceo+Tripura");
    }
    if(item === 'instagram') {
      window.open("https://www.instagram.com/chiefelectoralofficerTripura/");
    }
  } 

  routeGoTo(item) {
    if(item === 'home') {
      this.router.navigate(['/dashboard']);
    }
    if(item === 'registration') {
      this.router.navigate(['/profile']);
    }
    if(item === 'test') {
      this.router.navigate(['/exam']);
    }
    if(item === 'about') {
      this.router.navigate(['/about']);
    }
    if(item === 'material') {
      this.router.navigate(['/material']);
    }
    if(item === 'logout') {
      localStorage.clear();
      this.router.navigate(['/']);
    }
  }

}
