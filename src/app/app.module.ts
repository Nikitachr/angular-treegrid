import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { SparklineAllModule } from '@syncfusion/ej2-angular-charts';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { DropDownListAllModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { ButtonAllModule , CheckBoxAllModule} from '@syncfusion/ej2-angular-buttons';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import {
  TreeGridAllModule,
  PageService,
  SortService,
  FilterService,
  ContextMenuService,
  FreezeService
} from '@syncfusion/ej2-angular-treegrid';

import { AppComponent } from './app.component';
import { ColumnStylesFormComponent } from './column-styles-form/column-styles-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatOptionModule } from "@angular/material/core";
import { DialogComponent } from "src/app/dialog/dialog.component";
import { ChooseColumnsComponent } from './choose-columns/choose-columns.component';
import { AddRowComponent } from './add-row/add-row.component';
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    ColumnStylesFormComponent,
    DialogComponent,
    ChooseColumnsComponent,
    AddRowComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    TreeGridAllModule,
    SparklineAllModule,
    DialogModule,
    DropDownListAllModule,
    MultiSelectAllModule,
    ToolbarModule,
    ButtonAllModule,
    CheckBoxAllModule,
    DatePickerModule,
    NumericTextBoxAllModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    FreezeService,
    ContextMenuService,
    PageService,
    SortService,
    FilterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
