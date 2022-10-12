import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss', '../../app.component.scss']
})
export class AboutComponent implements OnInit {
  userinfo: any;
  constructor(private router: Router) { }
  ngOnInit() {
    this.userinfo = JSON.parse(localStorage.getItem('aeci-userifo'));
  }

  routeGoTo(item) {
    if(item === 'home') {
      if(this.userinfo) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['']);
      }
    }
    if(item === 'about') {
      this.router.navigate(['/about']);
    }
    if(item === 'registration') {
      if(this.userinfo) {
        localStorage.setItem('aeci-page', 'registration');
        this.router.navigate(['/profile']);
      } else {
        this.router.navigate(['login']);
      }
    }
    if(item === 'test') {
      if(this.userinfo) {
        localStorage.setItem('aeci-page', 'test');
        this.router.navigate(['/exam']);
      } else {
        this.router.navigate(['login']);
      }
    }
    if(item === 'dashboard') {
      if(this.userinfo) {
        localStorage.setItem('aeci-page', 'dashboard');
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['login']);
      }
    }
    if(item === 'material') {
      if(this.userinfo) {
        localStorage.setItem('aeci-page', 'material');
        this.router.navigate(['/material']);
      } else {
        this.router.navigate(['login']);
      }
    }
    if(item === 'logout') {
      localStorage.clear();
      this.router.navigate(['']);
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
