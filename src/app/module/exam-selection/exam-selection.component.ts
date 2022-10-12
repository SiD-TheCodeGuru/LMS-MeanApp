import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WarningComponent } from '../warning/warning.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { UrlListService } from '../services/url-list.service';

@Component({
  selector: 'app-exam-selection',
  templateUrl: './exam-selection.component.html',
  styleUrls: ['./exam-selection.component.scss', '../../app.component.scss']
})
export class ExamSelectionComponent implements OnInit {
  category = '';
  categoryList = [];
  progressBar = false;
  userinfo: any;
  noContent = false;
  examTaken = false;
  constructor(private router: Router, public dialog: MatDialog, private http: HttpClient, private urlListService: UrlListService) { }

  ngOnInit() {
    this.userinfo = JSON.parse(localStorage.getItem('aeci-userifo'));
    this.getMaterial();
  }

  getMaterial() {
    let response: any;
    this.http.get('assets/material-list.json')
    .subscribe(event => { 
      response = event;
      this.categoryList = response;
    });
  }

  startTest(form: NgForm) {
    this.noContent = false;
    if (!form.valid) {
      return;
    }
    this.progressBar = true;
    this.examTaken = false;
    let response: any;
      this.http.get(this.urlListService.urls.getQuestion + 'ALMT/' + this.category)
      .subscribe(event => { 
        response = event;
        if(response.length) {
          localStorage.setItem('aeci-category', this.category);
          localStorage.setItem('aeci-question', JSON.stringify({value: response}));
          this.checkTest();
        } else {
          this.progressBar = false;
          this.noContent = true;
        }
      });
  }

  checkTest() {
    let response: any;
    this.examTaken = false;
      this.http.post(this.urlListService.urls.checkExamStatus, { user_id: this.userinfo.id, category: this.category })
      .subscribe(event => { 
        response = event;
        this.progressBar = false;
        if(response.length === 0) {
          this.router.navigate(['/test']);
        } else {
          if(response[0].result === 'Need to Improve') {
            this.router.navigate(['/test']);
          } else {
            this.examTaken = true;
          }
        }
      });
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
    if(item === 'material') {
      this.router.navigate(['/material']);
    }
    if(item === 'about') {
      this.router.navigate(['/about']);
    }
    if(item === 'logout') {
      localStorage.clear();
      this.router.navigate(['/']);
    }
  }

  getWarningMessage(subject, message) {
    const dialogRef = this.dialog.open(WarningComponent, {
      disableClose: true,
      width: '400px',
      panelClass: 'warning-wrapper',
      data: {'subject': subject, 'message': message}
    });

    dialogRef.afterClosed().subscribe(result => {
      var page = localStorage.getItem('aeci-page');
      if(result) {
        if(page === 'test') {
          this.router.navigate(['/exam']);
        } else {
          this.router.navigate(['']);
        }
      }
    });
  }

  goto(item) {
    if(item === 'facebook') {
      window.open("https://m.facebook.com/people/Chief-Electoral-Officer-Tripura/100067971144825/");
    }
    if(item === 'twitter') {
      window.open("https://twitter.com/ceotripura?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor");
    }
    if(item === 'youtube') {
      window.open("");
    }
    if(item === 'instagram') {
      window.open("https://www.instagram.com/ceo_tripura/");
    }
  }

}
