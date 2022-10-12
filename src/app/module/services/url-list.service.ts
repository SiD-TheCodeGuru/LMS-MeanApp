import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlListService {

  //preUrl = 'https://api.assametap.in/';
  preUrl = 'http://localhost:9000/';
    
  urls = {
    login: this.preUrl + 'login',
    saveProfile: this.preUrl + 'user',
    updateProfile: this.preUrl + 'user/',
    saveExam: this.preUrl + 'result',
    getJobRoles: this.preUrl + 'role',
    getQuestion: this.preUrl + 'questions/',
    getDashboard: this.preUrl + 'dashboard',
    uploadQuestion: this.preUrl + 'questions/',
    downloadQuestion: this.preUrl + 'questions/download/',
    createUsers: this.preUrl + 'user/bulkCreate',
    getReport: this.preUrl + 'report/',
    checkExamStatus: this.preUrl + 'examstatus',
    updatepassword: this.preUrl + 'updatepassword'
  };
  
  constructor() {}
  
}
