import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { WarningComponent } from '../warning/warning.component';
import { ExportExcelService } from 'src/app/services/export-excel.service';
import { UrlListService } from '../services/url-list.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss', '../../app.component.scss']
})
export class UsersComponent implements OnInit {

  numberOfUsers: number;
  jobRole: any;
  displayName= 'Admin';
  district: any;
  districtList = [    
    {"display":"All","name":"All","code":"678", "userdisplay":"","pre":""},
    {name:'West Tripura - West-Tripura (01)',code:'01'},
    {name:'Sepahijala - Sepahijala (02)',code:'02'},
    {name:'Gomati - Gomati (03)',code:'03'},
    {name:'South Tripura - South-Tripura (04)',code:'04'},
    {name:'Khowai - Khowai (05)',code:'05'},
    {name:'North Tripura - North-Tripura (06)',code:'06'},
    {name:'Dhalai - Dhalai (07)',code:'07'},
    {name:'Unakoti - Unakoti (08)',code:'08'}
  ];
  roleList = [
    { "name": "ADMIN", "value":"ADMIN"},
    { "name": "ADMINEO", "value":"ADMINEO"},
    { "name": "ALMT", "value":"ALMT"},
    { "name": "DLMT" , "value":"DLMT"},
    { "name": "RO", "value":"RO" },
    { "name": "DEO", "value":"DEO" },
    { "name": "DY DEO", "value":"DY DEO" },
    { "name": "ERO", "value":"ERO" },
    { "name": "AERO", "value":"AERO" },
    { "name": "POLLING PERSONNEL", "value":"PP" },
    { "name": "SECTOR OFFICER", "value":"SO" },
    { "name": "ZONAL OFFICER", "value":"ZO" },
    { "name": "ELECTION EXPENDITURE MONITORING", "value":"EEM" },
    { "name": "MODEL CODE OF CONDUCT", "value":"MCC" },
    { "name": "MICRO OBSERVER", "value":"MOBS" },
    { "name": "BOOTH LEVEL OBSERVER", "value":"BLOBS" },
    { "name": "BOOTH LEVEL OFFICER", "value":"BLOS" },
    { "name": "ASST EXPENDITURE OBSERVER", "value":"AEXPO" },
    { "name": "EVM MANAGEMENT", "value":"EVMM" },
    { "name": "VIDEOGRAPHER", "value":"VIDEO" },
    { "name": "COUNTING", "value":"COUN" },
    { "name": "POSTAL BALLOT", "value":"PB" },
    { "name": "IT DISTRICT NODAL OFFICER", "value":"IDNO" },
    { "name": "IT ASSEMBLY LEVEL NODAL OFFICER", "value":"IALNO" },
    { "name": "ASST RETURNING OFFICER", "value":"ARO" }
  ];
  userinfo: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private ete: ExportExcelService,
    private urlListService: UrlListService
  ) { }

  ngOnInit() {
    this.userinfo = JSON.parse(localStorage.getItem('aeci-userifo'));
    if(this.userinfo === null) {
      localStorage.clear();
      this.router.navigate(['']);
    }
    if(this.userinfo) {
      if(this.userinfo.job_role !== 'ADMIN' || this.userinfo.username !== 'superadminister') {
        localStorage.clear();
        this.router.navigate(['']);
      }
      this.getJobRoles();
    }
    this.getJobRoles();
  }

  getJobRoles() {
    let response: any;
    this.http.get('assets/role-list.json')
    .subscribe(event => { 
      response = event;
      //this.roleList = response;
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

  routeGoTo(item) {
    if(item === 'home') {
      this.router.navigate(['/administer-access']);
    }
    if(item === 'user') {
      this.router.navigate(['/administer-user']);
    }
    if(item === 'question') {
      this.router.navigate(['/administer-question']);
    }
    if(item === 'report') {
      this.router.navigate(['/administer-report']);
    }
    if(item === 'logout') {
      this.router.navigate(['']);
    }
  }

  onCreateUsers() {
    // this.getWarningMessage('Bulk User Create', 'This process might take some time, please seat back!');  
    const users = this.generateCredentials();
    // let dataForExcel = [];
    // users.forEach((row: any, index: number) => {
    //   dataForExcel.push(Object.values(row));
    // })
    // const reportData = {
    //   title: this.jobRole + '-users-list-' + new Date(),
    //   data: dataForExcel,
    //   //headers: Object.keys(users[0])
    //   headers: ['Sl No', 'Username', 'Password', 'Job Role']
    // }
    // this.ete.exportExcel(reportData);
    this.http.post(this.urlListService.urls.createUsers, users)
      .subscribe(event => {
        if (event === 'Successfully created the users') {
          let dataForExcel = [];
          users.forEach((row: any) => {
            dataForExcel.push(Object.values(row))
          })
          const reportData = {
            title: 'users_list_' + this.district.name + '_' + this.jobRole.name + '_' + this.formatDate(new Date()),
            data: dataForExcel,
            headers: ['Sl No', 'Username', 'Password', 'Job Role']
          }
          this.ete.exportExcel(reportData);
        }
      });
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

    return [day, month, year].join('-');
  }

  generateCredentials() {
    let users: {sl: number, username: string, password: string, job_role: string}[] = [];
    for (let i=0; i < this.numberOfUsers; i++ ) {
      users.push({
        sl: i+1,
        username: this.jobRole.value.toLowerCase() + this.district.code + Math.random().toString(36).slice(-5),
        password: Math.random().toString(36).slice(-8),
        job_role: this.jobRole.name
      })
    }
    return users;
  }

  getWarningMessage(subject, message) {
    const dialogRef = this.dialog.open(WarningComponent, {
      disableClose: true,
      width: '400px',
      panelClass: 'warning-wrapper',
      data: {'subject': subject, 'message': message}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.router.navigate(['']);
      }
    });
  }


}
