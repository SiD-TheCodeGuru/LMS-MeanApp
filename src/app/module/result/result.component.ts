import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss', '../../app.component.scss']
})
export class ResultComponent implements OnInit {
  username = '';
  resultValue = '';
  dateValue = '';
  userinfo: any;
  
  constructor(private router: Router) {}
  ngOnInit() {
    var temp = JSON.parse(localStorage.getItem('aeci-userifo'));
    var tempDate = new Date();
    this.userinfo = temp;
    this.resultValue = localStorage.getItem('aeci-tsc');
    this.dateValue = this.formatDate(tempDate);
    if(this.resultValue === 'passed') {
      setTimeout(()=> {
        this.downloadCertificate();
      }, 3000);
    }
  }

  downloadCertificate() {
    let data = document.getElementById('certificate');  
    html2canvas(data).then(canvas => {
    const contentDataURL = canvas.toDataURL('image/png')  
    // let pdf = new jspdf('l', 'cm', 'a4'); //Generates PDF in landscape mode
    // let pdf = new jspdf('p', 'cm', 'a4'); Generates PDF in portrait mode
    let pdf = new jspdf();
    pdf.addImage(contentDataURL, 'PNG', 0, 0, 220, 140);  
    pdf.save('tetlms_certificate_' + this.userinfo.name  + '_' + this.userinfo.emer_contact_no + '_' + this.userinfo.emp_id + '.pdf');   
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

}
