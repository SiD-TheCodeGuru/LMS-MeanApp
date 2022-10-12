import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { NgForm, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WarningComponent } from '../warning/warning.component';
import { UrlListService } from '../services/url-list.service';
import { stringify } from '@angular/compiler/src/util';
export interface DialogData {
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../app.component.scss']
})
export class LoginComponent implements OnInit {

  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  jobRole = new FormControl('', [Validators.required]);
  progressBar = false;
  credential = false;
  loginData = { username: '', password: '', jobRole: 'ALMT' };
  roleList = [];
  constructor(private router: Router, private http: HttpClient, public dialog: MatDialog, private urlListService: UrlListService) { }

  ngOnInit() {
    this.getJobRoles();
  }

  getJobRoles() {
    let response: any;
    this.http.get('assets/role-list.json')
    .subscribe(event => { 
      response = event;
      this.roleList = response;
    });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    if(this.loginData.username !== '' && this.loginData.password !== '' && this.loginData.jobRole !== '') {
      this.progressBar = true;
      this.credential = false;
      let response: any;
      this.http.post(this.urlListService.urls.login, { username: this.loginData.username, password: this.loginData.password, job_role: this.loginData.jobRole})
      .subscribe(event => { 
        this.progressBar = false;
        response = event;
        if(response.length > 0) {
          localStorage.setItem('aeci-userifo', JSON.stringify(response[0]));
          var page = localStorage.getItem('aeci-page');
          if(response[0].job_role.toLowerCase() === 'admin') {
            this.router.navigate(['/administer-access']);
          } else if(response[0].job_role.toLowerCase() === 'admineo') {
            this.router.navigate(['/eo/' + Math.floor((Math.random() * 1000) + 5) + '/jt56eqw7']);
          } else {
            if(page === 'registration') {
              this.router.navigate(['/profile']);
            } else if(page === 'test') {
              if(response[0].profile_check === 1) {
                this.router.navigate(['/exam']);
              } else {
                this.getWarningMessage('Registration Incomplete', 'Please complete Profile Registration first and then Take a Test.', 'pendingexam');
              }
            } else if(page === 'material') {
              this.router.navigate(['/material']);
            } else {
              this.router.navigate(['/dashboard']);
            }
          }    
        }
        if(response.length === 0) {
          this.credential = true;
        }
      });
    }
  }

  getWarningMessage(subject, message, type) {
    const dialogRef = this.dialog.open(WarningComponent, {
      disableClose: true,
      width: '400px',
      panelClass: 'warning-wrapper',
      data: {'subject': subject, 'message': message, "type": type}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  routeGoTo(item) {
    this.router.navigate(['']);
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