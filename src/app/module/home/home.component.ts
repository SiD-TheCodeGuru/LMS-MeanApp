import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../../app.component.scss']
})
export class HomeComponent implements OnInit {
  url = './assets/election-trainning-material-phase-one.pdf';
  materialList = [
    { name: 'covid', display: 'BROAD GUIDELINES FOR CONDUCT OF GENERAL ELECTIONS/ BYE-ELECTIONS DURING COVID-19' },
    { name: 'https://ceotripura.nic.in/', display: 'Office of the Chief Electoral Officer, Tripura' },
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
  constructor(private router: Router) { }
  ngOnInit() {
    localStorage.clear();
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
    if(item === 'about') {
      this.router.navigate(['/about']);
    }
    if(item === 'registration') {
      localStorage.setItem('aeci-page', 'registration');
      this.router.navigate(['/login']);
    }
    if(item === 'test') {
      localStorage.setItem('aeci-page', 'test');
      this.router.navigate(['/login']);
    }
    if(item === 'dashboard') {
      this.router.navigate(['/login']);
    }
    if(item === 'material') {
      localStorage.setItem('aeci-page', 'material');
      this.router.navigate(['/login']);
    }
  }
}
