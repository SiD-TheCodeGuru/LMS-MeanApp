import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { WarningComponent } from '../warning/warning.component';
import { ExportExcelService } from 'src/app/services/export-excel.service';
import { UrlListService } from '../services/url-list.service';

@Component({
  selector: 'app-eo',
  templateUrl: './eo.component.html',
  styleUrls: ['./eo.component.scss', '../../app.component.scss']
})
export class EOComponent implements OnInit {
  numberOfUsers: number;
  jobRole: any;
  displayName= 'Admin';
  district: any;
  districtList = [
    {name:'West-Tripura (01)',code:'01', username: 'eoWestTripura01'},
    {name:'Sepahijala (02)',code:'02', username: 'eoSepahijala02'},
    {name:'Gomati (03)',code:'03', username: 'eoGomati03'},
    {name:'South-Tripura (04)',code:'04', username: 'eoSouthTripura04'},
    {name:'Khowai (05)',code:'05', username: 'eoKhowai05'},
    {name:'North-Tripura (06)',code:'06', username: 'eoNorthTripura06'},
    {name:'Dhalai (07)',code:'07', username: 'eoDhalai07'},
    {name:'Unakoti (08)',code:'08', username: 'eoUnakoti08'},
  ];
  roleList = [
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
  eoData: any;
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
      if(this.userinfo.job_role !== 'ADMINEO') {        
        localStorage.clear();
        this.router.navigate(['']);
      }
      this.getJobRoles();
    }  
  }

  getJobRoles() {
    for(var i=0; i<this.districtList.length; i++) {
      if(this.districtList[i].username === JSON.parse(localStorage.getItem('aeci-userifo')).username) {
        console.log("Hi"+this.districtList[i].name)
        this.eoData = this.districtList[i];
      }
    }
    if(this.eoData === undefined) {
      localStorage.clear();
      this.router.navigate(['']);
    }
    let response: any;
    this.http.get('assets/role-list.json')
    .subscribe(event => { 
      response = event;
      this.roleList = response;
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
      this.router.navigate(['/eo/' + Math.floor((Math.random() * 1000) + 5) + '/jt56eqw7']);
    }
    if(item === 'dashboard') {
      this.router.navigate(['/administer-access']);
    }
    if(item === 'report') {
      this.router.navigate(['/administer-report']);
    }
    if(item === 'logout') {
      localStorage.clear();
      this.router.navigate(['']);
    }
  }

  onCreateUsers() {
    const users = this.generateCredentials();
    this.http.post(this.urlListService.urls.createUsers, users)
      .subscribe(event => {
        if (event === 'Successfully created the users') {
          let dataForExcel = [];
          users.forEach((row: any) => {
            dataForExcel.push(Object.values(row))
          })
          const reportData = {
            title: 'users_list_' + this.eoData.name + '_' + this.jobRole.name + '_' + this.formatDate(new Date()),
            data: dataForExcel,
            headers: ['Sl No', 'Username', 'Password', 'Job Role']
          }
          this.ete.exportExcel(reportData);
          this.numberOfUsers = 0;
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
        username: this.jobRole.value.toLowerCase() + this.eoData.code + Math.random().toString(36).slice(-5),
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
