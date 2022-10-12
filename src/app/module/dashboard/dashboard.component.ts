import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WarningComponent } from '../warning/warning.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../../app.component.scss']
})
export class DashboardComponent implements OnInit {
  url = './assets/election-trainning-material-phase-one.pdf';
  materialList = [
    { name: 'covid', display: 'BROAD GUIDELINES FOR CONDUCT OF GENERAL ELECTIONS/ BYE-ELECTIONS DURING COVID-19' },
    { name: 'http://ceotripura.nic.in/', display: 'Office of the Chief Electoral Officer, Tripura' },
    { name: 'https://eci.gov.in/', display: 'Office of the Election Commission of India' }
  ];
  newsList = [
    { name: 'Election Commission of India' },
    { name: 'Notification-GE to Lok Sabha-2019' },
    { name: 'Phase-I-Gazette Notification' },
    { name: 'Phase-II-Gazette Notification' },
    { name: 'Notification-GE to Lok Sabha-2019' },
    { name: 'Phase-II-Gazette Notification' },
  ];
  userinfo: any;
  constructor(private router: Router, public dialog: MatDialog) { }
  ngOnInit() {
    this.userinfo = JSON.parse(localStorage.getItem('aeci-userifo'));
  }

  onDownload(item) {
    if(item.name === 'covid') {
      let link = document.createElement("a");
      link.download = 'Guidelines_for_Conduct_of_General_Election_Bye_elect_on_during_COVID-19';
      link.href = './assets/Guidelines_for_Conduct_of_General_Election_Bye_elect_on_during_COVID-19.pdf';
      link.click();
    } else {
      window.open(item.name);
    } 
  }

  takeTest() {
    this.router.navigate(['/exam']);
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

  getWarningMessage(subject, message, type) {
    const dialogRef = this.dialog.open(WarningComponent, {
      disableClose: true,
      width: '400px',
      panelClass: 'warning-wrapper',
      data: {'subject': subject, 'message': message, 'type': type}
    });

    dialogRef.afterClosed();
  }

  routeGoTo(item) {
    if(item === 'registration') {
      this.router.navigate(['/profile']);
    }
    if(item === 'about') {
      this.router.navigate(['/about']);
    }
    if(item === 'test') {
      if(this.userinfo.profile_check === 1) {
        this.router.navigate(['/exam']);
      } else {
        this.getWarningMessage('Registration Incomplete', 'Please complete Profile Registration first and then Take a Test.', 'pendingexam');
      }
    }
    if(item === 'dashboard') {
      if(this.userinfo.job_role === 'ADMIN') {
        this.router.navigate(['/administer-access']);
      } else {
        this.getWarningMessage('Not Authorized', 'You are NOT AUTHORIZED to access this module. Be aware of UNAUTHORISED access !', 'pendingexam');
      }
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
