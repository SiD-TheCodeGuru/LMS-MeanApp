import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  jobRole;
  constructor(
    private http: HttpClient,
    private el: ElementRef
  ) { }

  ngOnInit() {
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
      this.http
        //post the form data to the url defined above and map the response. Then subscribe //to initiate the post. if you don't subscribe, angular wont post.
        .post("http://localhost:3000/questions/" + this.jobRole, formData).subscribe(event => {
          if (event === 'Successfully created the users') {

          }
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

  menuItems(item) {

  }

  onCreateUsers() {
    
  }

}
