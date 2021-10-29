import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  columnName: string,
  columnType: string
}

export const editTypesArr = [
  {
    name: 'Number', type: 'numericedit'
  },
  {
    name: 'Text', type: 'defaultedit'
  },
  {
    name: 'Drop', type: 'dropdownedit'
  },
  {
    name: 'Checkbox', type: 'booleanedit'
  },
  {
    name: 'Date', type: 'datepickeredit'
  },
  {
    name: 'Date time', type: 'datepickeredit'
  }
];

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  public editTypesArr = editTypesArr;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  public onNoClick(): void {
    this.dialogRef.close();
  }

}
