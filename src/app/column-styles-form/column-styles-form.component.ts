import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { editTypesArr } from '../dialog/dialog.component';

@Component({
  selector: 'app-column-styles-form',
  templateUrl: './column-styles-form.component.html',
  styleUrls: ['./column-styles-form.component.scss']
})
export class ColumnStylesFormComponent {

  public editTypesArr = editTypesArr;

  public form = new FormGroup({
    headerText: new FormControl(),
    minWidth: new FormControl(),
    textAlign: new FormControl(),
    defaultValue: new FormControl(),
    editType: new FormControl(),
    fontSize: new FormControl(),
    color: new FormControl(),
    backgroundColor: new FormControl(),
    textWrap: new FormControl()
  })

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private matDialogRef: MatDialogRef<ColumnStylesFormComponent>) {
    this.form.patchValue(data);
  }

  public cancelChanges(): void {
    this.matDialogRef.close();
  }

  public saveChanges(): void {
    this.matDialogRef.close(this.form.value);
  }
}
