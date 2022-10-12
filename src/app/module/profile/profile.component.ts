import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WarningComponent } from '../warning/warning.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { UrlListService } from '../services/url-list.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss', '../../app.component.scss']
})
export class ProfileComponent implements OnInit {

  loginData = { 
    name: '', 
    gender: '',
    trainingtype: '',
    contact: '',
    email:'',
    acontact: '',
    econtact: '',
    eid: '',
    designation: '',
    department: '',
    location: '',
    address: '',
    eduty: '',
    eworked: '',
    edesignation: '',
    dob: '',
    age: '',
    cedesignation: '',
    wdistrict: '',
    expertise: ''
  };
  electionWorked = [
    { name: '0' },
    { name: '1' },
    { name: '2' },
    { name: '3' },
    { name: '4' },
    { name: '5' },
    { name: '6' },
    { name: '7' },
    { name: '8' },
    { name: '9' },
  ];
  district = [
    {"display":"All","name":"All","code":"678", "userdisplay":"","pre":""},
    {"display":"West Tripura","name":"West Tripura (01)","code":"01", "userdisplay":"","pre":"eoWest-Tripura01"},
    {"display":"Sepahijala","name":"Sepahijala (02)","code":"02", "userdisplay":"","pre":"eoSepahijala02"},
    {"display":"Gomati","name":"Gomati (03)","code":"03", "userdisplay":"","pre":"eoGomati03"},
    {"display":"South Tripura","name":"South Tripura (04)","code":"04", "userdisplay":"","pre":"eoSouth-Tripura04"},
    {"display":"Khowai","name":"Khowai (05)","code":"05", "userdisplay":"","pre":"eoKhowai05"},
    {"display":"North Tripura","name":"North Tripura (06)","code":"06", "userdisplay":"","pre":"eoNorth-Tripura06"},
    {"display":"Dhalai","name":"Dhalai (07)","code":"07", "userdisplay":"","pre":"eoDhalai07"},
    {"display":"Unakoti","name":"Unakoti (08)","code":"08", "userdisplay":"","pre":"eoUnakoti08"}
  ];
  expertiseList = [
    { name: 'Elector Roll and ERONET' },
    { name: 'DEMP' },
    { name: 'Vulnerability Mapping' },
    { name: 'Covid Guidelines' },
    { name: 'MCC' },
    { name: 'EEM Paid News' },
    { name: 'MCMC AND Social Media' },
    { name: 'SVEEP' },
    { name: 'AMF' },
    { name: 'Polling Station & Poll day Arrangements' },
    { name: 'EVM-VVPAT' },
    { name: 'Postal Ballot' },
    { name: 'ETPBS' },
    { name: 'Counting' },
    { name: 'ICT Applications' },
  ];
  userinfo: any;
  goRoute = false;
  makeDisabled = false;
  constructor(private router: Router, public dialog: MatDialog, private http: HttpClient, private urlListService: UrlListService) { }

  ngOnInit() {
    this.userinfo = JSON.parse(localStorage.getItem('aeci-userifo'));
    this.loadValues(this.userinfo);
  }

  loadValues(userinfo) {
    this.loginData.name = userinfo.name; 
    this.loginData.gender = userinfo.gender;
    this.loginData.trainingtype = userinfo.training_type;
    this.loginData.contact = userinfo.contact_no;
    this.loginData.email = userinfo.email;
    this.loginData.acontact = userinfo.alt_contact_no;
    this.loginData.econtact = userinfo.emer_contact_no
    this.loginData.eid = userinfo.emp_id;
    this.loginData.designation = userinfo.designation;
    this.loginData.department = userinfo.department;
    this.loginData.location = userinfo.current_work_location;
    this.loginData.address = userinfo.address;
    this.loginData.eduty = userinfo.exp_in_elec;
    this.loginData.eworked = userinfo.no_of_elec_work;
    this.loginData.edesignation = userinfo.desig_in_elec;
    this.loginData.dob = userinfo.dob;
    this.loginData.age = userinfo.age;
    this.loginData.cedesignation = userinfo.desig_cur_elec;
    this.loginData.wdistrict = userinfo.working_district;
    this.loginData.expertise = userinfo.exp_in_elec_duty;
  }

  onSaveNote(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.makeDisabled = true;
    var data = {
      user_id: this.userinfo.id,
      name: this.loginData.name,
      address: this.loginData.address ? this.loginData.address : '',
      contact_no: this.loginData.contact,
      job_role: this.userinfo.job_role,
      alt_contact_no: this.loginData.acontact,
      emer_contact_no: this.loginData.econtact ? this.loginData.econtact : '',
      emp_id: this.loginData.eid ? this.loginData.eid : '',
      designation: this.loginData.designation,
      department: this.loginData.department,
      current_work_location: this.loginData.location ? this.loginData.location : '',
      exp_in_elec: this.loginData.expertise ? this.loginData.expertise : '',
      no_of_elec_work: this.loginData.eworked ? this.loginData.eworked : '',
      desig_in_elec: this.loginData.edesignation ? this.loginData.edesignation : '',
      dob: this.loginData.dob,
      gender: this.loginData.gender,
      age: '',
      desig_cur_elec: this.loginData.cedesignation ? this.loginData.cedesignation : '',
      working_district: this.loginData.wdistrict,
      exp_in_elec_duty: this.loginData.expertise ? this.loginData.expertise : '',
      attnd_dur_elec: this.loginData.expertise ? this.loginData.expertise : '',
      email: this.loginData.email,
      training_type: ''
    };
    
    let response: any;
    if(this.userinfo.profile_check === 0) {
      this.http.post(this.urlListService.urls.saveProfile, data)
      .subscribe(event => {
        response = event;
        if(response.created) {
          this.userinfo.name = this.loginData.name;
          this.userinfo.emp_id = this.loginData.eid ? this.loginData.eid : ''; 
          this.userinfo.emer_contact_no = this.loginData.econtact ? this.loginData.econtact : '';
          this.userinfo.designation = this.loginData.designation;
          this.userinfo.department = this.loginData.department;
          this.userinfo.working_district = this.loginData.wdistrict;
          this.userinfo.exp_in_elec_duty = this.loginData.expertise;
          this.userinfo.address = this.loginData.address;
          this.userinfo.contact_no = this.loginData.contact;
          this.userinfo.alt_contact_no = this.loginData.acontact;
          this.userinfo.current_work_location = '';
          this.userinfo.exp_in_elec = this.loginData.eduty;
          this.userinfo.no_of_elec_work = this.loginData.eworked;
          this.userinfo.desig_in_elec = '';
          this.userinfo.dob = this.loginData.dob;
          this.userinfo.gender = this.loginData.gender;
          this.userinfo.age = '';
          this.userinfo.desig_cur_elec = '';
          this.userinfo.email = this.loginData.email;
          this.userinfo.training_type = this.loginData.trainingtype;
          this.userinfo.profile_check = 1;

          localStorage.setItem('aeci-userifo', JSON.stringify(this.userinfo));
          this.goRoute = true;
          this.getWarningMessage('Registration Completion', 'Your profile information is saved successfully.', '');
        }
      });
    } 
    if(this.userinfo.profile_check === 1) {
      this.http.put(this.urlListService.urls.updateProfile + this.userinfo.id, data)
      .subscribe(event => {
        response = event;
        this.userinfo.name = this.loginData.name;
        this.userinfo.designation = this.loginData.designation;
        this.userinfo.department = this.loginData.department;
        this.userinfo.working_district = this.loginData.wdistrict;
        this.userinfo.exp_in_elec_duty = this.loginData.expertise;
        this.userinfo.address = this.loginData.address;
        this.userinfo.contact_no = this.loginData.contact;
        this.userinfo.alt_contact_no = this.loginData.acontact;
        this.userinfo.emp_id = this.loginData.eid ? this.loginData.eid : ''; 
        this.userinfo.emer_contact_no = this.loginData.econtact ? this.loginData.econtact : '';
        this.userinfo.current_work_location = this.loginData.location;
        this.userinfo.exp_in_elec = this.loginData.eduty;
        this.userinfo.no_of_elec_work = this.loginData.eworked;
        this.userinfo.desig_in_elec = '';
        this.userinfo.dob = this.loginData.dob;
        this.userinfo.gender = this.loginData.gender;
        this.userinfo.age = '';
        this.userinfo.desig_cur_elec = this.loginData.cedesignation;
        this.userinfo.email = this.loginData.email;
        this.userinfo.training_type = this.loginData.trainingtype;
        localStorage.setItem('aeci-userifo', JSON.stringify(this.userinfo));
        this.goRoute = true;
        this.getWarningMessage('Registration Updation', 'Your profile information is updated successfully.', '');
      });
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

  routeGoTo(item) {
    if(item === 'home') {
      this.router.navigate(['/dashboard']);
    }
    if(item === 'about') {
      this.router.navigate(['/about']);
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

    dialogRef.afterClosed().subscribe(result =>{
      if(this.goRoute) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

}
