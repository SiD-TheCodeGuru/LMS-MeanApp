import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { WarningComponent } from '../warning/warning.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss', '../../app.component.scss']
})
export class MaterialComponent implements OnInit {
  url = './assets/election-trainning-material-phase-one.pdf';
  materialList = [
    { name: '04_representation of the people act, 1951 (1).pdf', display: 'Representation of the people act, 1951', contentList: [] },
    { name: 'Guidelines for issue of Postal Ballot Papers..pdf', display: 'Guidelines for issue of Postal Ballot Papers', contentList: [] },
    { name: 'Hand_book_for_Returning_Officer_Document_23_-_Edition_-1.pdf', display: 'Handbook for Returning Officer Section I', contentList: [] },
    { name: 'Prevention of Disqualification amendment Act 2006.pdf', display: 'Prevention of Disqualification amendment Act 2006', contentList: [] },
    { name: 'Prevention of Disqualification amendment act 2013.pdf', display: 'Prevention of Disqualification amendment act 2013', contentList: [] },
  ];
  selectedId = 1;
  userinfo:  any;
  constructor(private router: Router, private http: HttpClient, public dialog: MatDialog) { }

  ngOnInit() {
    this.userinfo = JSON.parse(localStorage.getItem('aeci-userifo'));
    this.getMaterial();
  }

  getList(item) {
    this.selectedId = item.id;
  }

  getMaterial() {
    let response: any;
    this.http.get('assets/material-list.json')
    .subscribe(event => { 
      response = event;
      this.materialList = response;
    });
  }

  onDownload(item) {
    let link = document.createElement("a");
    link.download = item;
    link.href = './assets/material/' + item;
    link.click(); 
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

  routeGoTo(item) {
    if(item === 'home') {
      this.router.navigate(['/dashboard']);
    }
    if(item === 'registration') {
      this.router.navigate(['/profile']);
    }
    if(item === 'test') {
      if(this.userinfo.profile_check === 1) {
        this.router.navigate(['/exam']);
      } else {
        this.getWarningMessage('Registration Incomplete', 'Please complete Profile Registration first and then Take a Test.', 'pendingexam');
      }
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

  getWarningMessage(subject, message, type) {
    const dialogRef = this.dialog.open(WarningComponent, {
      disableClose: true,
      width: '400px',
      panelClass: 'warning-wrapper',
      data: {'subject': subject, 'message': message, "type": type}
    });

    dialogRef.afterClosed();
  }

}
