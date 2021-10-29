import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-choose-columns',
  templateUrl: './choose-columns.component.html',
  styleUrls: ['./choose-columns.component.scss']
})
export class ChooseColumnsComponent implements OnInit {

  public visibleColumns: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<ChooseColumnsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.visibleColumns = this.data.visible
  }

  public addCol(value: string): void {
    if (this.visibleColumns.includes(value)) {
      const index = this.visibleColumns.indexOf(value);
      this.visibleColumns.splice(index, 1);
    } else {
      this.visibleColumns.push(value)
    }
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

}
