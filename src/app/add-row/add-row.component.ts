import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-add-row',
  templateUrl: './add-row.component.html',
  styleUrls: ['./add-row.component.scss']
})
export class AddRowComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddRowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    for (let i = 0; i < this.data.dataKey.length; i++) {
      if (this.data.dataKey[i].type === 'numericedit') {
        this.data.dataKey[i].type = 'number';
      } else if (this.data.dataKey[i].type === 'booleanedit') {
        this.data.dataKey[i].type = 'checkbox';
      } else if (this.data.dataKey[i].type === 'datepickeredit') {
        this.data.dataKey[i].type = 'date';
      } else if (this.data.dataKey[i].type === 'datepickeredit') {
        this.data.dataKey[i].type = 'datetime';
      } else {
        this.data.dataKey[i].type = 'text';
      }
    }
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

}
