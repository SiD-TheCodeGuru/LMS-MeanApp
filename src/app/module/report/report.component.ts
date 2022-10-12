import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UrlListService } from '../services/url-list.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss', '../../app.component.scss']
})
export class ReportComponent implements OnInit {
  districtList = [
    {"display":"West Tripura","name":"West Tripura (01)","code":"01", "userdisplay":"","pre":"eoWest-Tripura01"},
    {"display":"Sepahijala","name":"Sepahijala (02)","code":"02", "userdisplay":"","pre":"eoSepahijala02"},
    {"display":"Gomati","name":"Gomati (03)","code":"03", "userdisplay":"","pre":"eoGomati03"},
    {"display":"South Tripura","name":"South Tripura (04)","code":"04", "userdisplay":"","pre":"eoSouth-Tripura04"},
    {"display":"Khowai","name":"Khowai (05)","code":"05", "userdisplay":"","pre":"eoKhowai05"},
    {"display":"North Tripura","name":"North Tripura (06)","code":"06", "userdisplay":"","pre":"eoNorth-Tripura06"},
    {"display":"Dhalai","name":"Dhalai (07)","code":"07", "userdisplay":"","pre":"eoDhalai07"},
    {"display":"Unakoti","name":"Unakoti (08)","code":"08", "userdisplay":"","pre":"eoUnakoti08"}
  ];
  roleList = [];
  district: '';
  displayName= 'Admin';
  categoryList = [];
  category: '';
  jobRole: '';
  userinfo: any;
  eoData: any;
  constructor(private router: Router, private http: HttpClient, private urlListService: UrlListService) { }
  ngOnInit() {
    this.userinfo = JSON.parse(localStorage.getItem('aeci-userifo'));
    if(this.userinfo.job_role === 'ADMIN') {
      this.getMaterial();
      this.getJobRoles();
    } else {
      for(var i=0; i<this.districtList.length; i++) {
        if(this.districtList[i].pre === this.userinfo.username) {
          this.eoData = this.districtList[i];
        }
      }
      if(this.eoData === undefined) {
        localStorage.clear();
        this.router.navigate(['']);
      }
      this.displayName = this.eoData.name;
      this.district = this.eoData.display;
    }
  }

  getJobRoles() {
    let response: any;
    this.http.get('assets/role-list.json')
    .subscribe(event => { 
      response = event;
      this.roleList = response;
    });
  }

  getMaterial() {
    let response: any;
    this.http.get('assets/material-list.json')
    .subscribe(event => { 
      response = event;
      this.categoryList = response;
    });
  }
  
  routeGoTo(item) {
    if(item === 'home') {
      if(this.userinfo.job_role === 'ADMINEO') {
        this.router.navigate(['/eo/' + Math.floor((Math.random() * 1000) + 5) + '/jt56eqw7']);
      } else {
        this.router.navigate(['/administer-access']);
      }
    }
    if(item === 'dashboard') {
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

  generateReport() {
    if(this.userinfo.job_role === 'ADMIN') {
      location.replace(this.urlListService.urls.getReport + this.district + '/' + this.jobRole + '/'  +this.category);  
    } 
    if(this.userinfo.job_role === 'ADMINEO') {
      location.replace(this.urlListService.urls.getReport + this.district + '/All/All');  
    }
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
