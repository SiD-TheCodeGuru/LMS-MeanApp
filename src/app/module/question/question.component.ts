import { Component, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { WarningComponent } from '../warning/warning.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UrlListService } from '../services/url-list.service';
@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss', '../../app.component.scss']
})
export class QuestionComponent implements OnInit {
  jobRole = 'ALMT';
  category = '';
  categoryList = [];
  displayName = 'Admin';
  constructor(private router: Router, private http: HttpClient, private el: ElementRef, public dialog: MatDialog, private urlListService: UrlListService) {}
  ngOnInit() {
    this.getMaterial();
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

  upload() {
    //locate the file element meant for the file upload.
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#file');
    //get the total amount of files attached to the file input.
    let fileCount: number = inputEl.files.length;
    //create a new fromdata instance
    let formData = new FormData();
    //check if the filecount is greater than zero, to be sure a file was selected.
    if (fileCount > 0) { // a file was selected
      //append the key name 'photo' with the first file in the element
      formData.append('file', inputEl.files.item(0));
      //call the angular http method
      let response: any;
      this.http
        //post the form data to the url defined above and map the response. Then subscribe //to initiate the post. if you don't subscribe, angular wont post.
        //this.urlListService.urls.getJobRoles      
        .post(this.urlListService.urls.uploadQuestion + this.jobRole + "/" + this.category, formData).subscribe(event => {
          response = event;  
        if (response.created) {
            this.getWarningMessage('Upload Success', 'Questions is saved successfully.', 'pendingexam');
          }
        });
    }
  }

  downloadQuestions() {
    location.replace(this.urlListService.urls.downloadQuestion + this.jobRole);
  }

  getWarningMessage(subject, message, type) {
    const dialogRef = this.dialog.open(WarningComponent, {
      disableClose: true,
      width: '400px',
      panelClass: 'warning-wrapper',
      data: {'subject': subject, 'message': message, 'type': type}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
      }
    });
  }

}
