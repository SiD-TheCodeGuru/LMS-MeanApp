import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {}

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.scss']
})
export class WarningComponent implements OnInit {

  dataInfo = {
    subject: '',
    message: '',
    type: ''
  };

  constructor(public dialogRef: MatDialogRef<WarningComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit() {
    this.getData(this.data); 
  }

  getData(item) {
    this.dataInfo.subject = item.subject;
    this.dataInfo.message = item.message;
    this.dataInfo.type = item.type;
  }

  close(item) {
    this.dialogRef.close(item);
  }

}
