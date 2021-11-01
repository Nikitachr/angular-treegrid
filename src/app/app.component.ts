import { Component, OnInit, ViewChild } from '@angular/core';

import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import {
  Column,
  RowDDService,
  PageService,
  TreeGridComponent,
  ContextMenuService,
  EditService,
  SelectionService,
  SortService
} from '@syncfusion/ej2-angular-treegrid';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { MatDialog } from "@angular/material/dialog";

import { ColumnStylesFormComponent } from "src/app/column-styles-form/column-styles-form.component";
import { filter, first, map } from "rxjs/operators";
import { DialogComponent } from './dialog/dialog.component';
import { ChooseColumnsComponent } from './choose-columns/choose-columns.component';
import { AddRowComponent } from './add-row/add-row.component';
import { ApiService } from "src/app/services/api.service";

export interface IColumnAttributes {
  editType: string;
  field: string;
  isPrimaryKey: boolean;
  headerText: string;
  format: string;
  width: string;
  textAlign: string;
  fontSize: number;
  color: string;
  defaultValue: any;
  minWidth: number;
  backgroundColor: string;
  textWrap: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    PageService,
    ContextMenuService,
    SortService,
    EditService,
    RowDDService,
    SelectionService
  ]
})
export class AppComponent implements OnInit {
  public data!: any[];
  public test: boolean = true;

  public wrapSettings!: any;
  public selectionSettings!: any;
  public childRow: boolean = false;
  public filter: boolean = false;
  public sort: boolean = true;
  public freeze: number = 0;

  public dialogCheck: boolean = true;

  public dialogMenuItems: any[] = [];
  public batchMenuItems: any[] = [];

  public filterDurationTemplate!: Object;
  public filterPriorityTemplate!: Object;
  public visibleColumns: any[] = [];

  private fieldName: string = '';
  private editIndex!: number;

  private rowIndex!: number;
  private prevRowIndex!: number;

  private copy: boolean = false;
  private copyContent: any = [];
  private cut: boolean = false;

  private columnName?: string;
  private columnType?: string;

  @ViewChild('treegrid')
  private treeGridObj!: TreeGridComponent | any;

  constructor(private dialog: MatDialog, private apiService: ApiService) {
  }

  public cols: Partial<IColumnAttributes>[] = [
    {
      field: 'taskID',
      isPrimaryKey: true,
      headerText: 'Task ID',
      width: '100',
      textAlign: 'Center',
      color: '#000',
      fontSize: 14,
      textWrap: 'off'
    },
    {
      field: 'taskName',
      headerText: 'Task Name',
      isPrimaryKey: false,
      width: '302',
      textAlign: 'Left',
      color: '#000',
      fontSize: 14,
      textWrap: 'off'
    },
    {
      editType: 'datepickeredit',
      field: 'startDate',
      isPrimaryKey: false,
      headerText: 'Start Date',
      format: 'yMd',
      width: '180',
      textAlign: 'Center',
      color: '#000',
      fontSize: 14,
      textWrap: 'off'
    },
    {
      editType: 'datepickeredit',
      field: 'endDate',
      isPrimaryKey: false,
      headerText: 'End Date',
      format: "yMd",
      width: '180',
      textAlign: 'Center',
      color: '#000',
      fontSize: 14,
      textWrap: 'off'
    },
    {
      editType: 'numericedit',
      field: 'duration',
      headerText: 'Duration',
      isPrimaryKey: false,
      width: '180',
      textAlign: 'Center',
      color: '#000',
      fontSize: 14,
      textWrap: 'off'
    },
    {
      editType: 'numericedit',
      field: 'progress',
      isPrimaryKey: false,
      headerText: 'Progress',
      width: '180',
      textAlign: 'Center',
      color: '#000',
      fontSize: 14,
      textWrap: 'off'
    },
    {
      field: 'priority',
      headerText: 'Priority',
      isPrimaryKey: false,
      width: '190',
      textAlign: 'Center',
      color: '#000',
      fontSize: 14,
      textWrap: 'off'
    },
  ]

  ngAfterViewInit(): void {
    this.addThousandRows();

  }

  ngOnInit(): void {
    this.updateData();

    this.wrapSettings = { wrapMode: 'Content' };
    this.selectionSettings = { type: 'Single' };
    this.dialogMenuItems = [
      'Save', 'Cancel', 'Update',
      { text: 'Add Column', target: '.e-headercontent', id: 'addColumn' },
      { text: 'Delete Column', target: '.e-headercontent', id: 'deleteColumn' },
      {
        text: `Filter: ${this.filter ? 'off' : 'on'}`,
        target: '.e-headercontent',
        id: 'filter'
      },
      {
        text: `MultiSort: ${this.sort ? 'off' : 'on'}`,
        target: '.e-headercontent',
        id: 'sort'
      },
      { text: 'Styles', target: '.e-headercontent', id: 'styles' },
      { text: `Freeze: ${this.freeze > 0 ? 'off' : 'on'}`, target: '.e-headercontent', id: 'freeze' },
      { text: 'Add Next', target: '.e-content', id: 'addNextRow' },
      { text: 'Add Child', target: '.e-content', id: 'addChildRow' },
      { text: 'Edit', target: '.e-content', id: 'editRow' },
      { text: 'Delete', target: '.e-content', id: 'deleteRow' },
      {
        text: `Multi select: ${this.selectionSettings.type === 'Multiple' ? 'off' : 'on'}`,
        target: '.e-content',
        id: 'multiSelect'
      },
      { text: 'Copy', target: '.e-content', id: 'customCopy' },
      { text: 'Cut', target: '.e-content', id: 'customCut' },
      { text: 'Paste Next', target: '.e-content', id: 'customPasteNext' },
      { text: 'Paste Child', target: '.e-content', id: 'customPasteChild' },
      { text: 'Choose', target: '.e-headercontent', id: 'chooseColumn' },
      'LastPage', 'NextPage', 'FirstPage', 'PrevPage'
    ];

    this.cols.forEach((col: any) => {
      this.visibleColumns.push(col.field)
    });

    this.getFilterDuration();
    this.getFilterPriority();
  }

  private addThousandRows(): void {

    // let index = 0;
    // const arr = [];
    //
    // for (let i = 1; i <= 1000; i++) {
    //   const data: any = {
    //     taskID: i,
    //     taskName: 'Plan #' + i,
    //     startDate: new Date('02/03/2017'),
    //     endDate: new Date('02/07/2017'),
    //     duration: Math.ceil(Math.random() * 10),
    //     progress: Math.ceil(Math.random() * 100),
    //     priority: 'Normal',
    //     approved: false,
    //     subtasks: []
    //   };
    //
    //   if (i % 5 === 1) {
    //     index++;
    //     arr.push(data);
    //   } else {
    //     arr[index - 1].subtasks.push(data);
    //   }
    //
    //   if (i === 1000) {
    //     this.data = arr;
    //   }
    // }
  }

  private deleteColumn(): void {
    const visibleIndex = this.visibleColumns.findIndex(col => col === this.fieldName);
    const index = this.cols.findIndex(col => col.field === this.fieldName);
    this.cols.splice(index, 1);
    this.visibleColumns.splice(visibleIndex, 1);
  }

  private addColumn(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: { columnName: this.columnName, columnType: this.columnType }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.columnName = result.columnName;
      this.columnType = result.columnType;
      this.cols.push({
        editType: this.columnType,
        field: this.columnName?.toLowerCase(),
        isPrimaryKey: false,
        headerText: this.columnName,
        defaultValue: 5,
        width: '180',
        textAlign: 'Center'
      })
      this.visibleColumns.push(this.columnName?.toLowerCase());
    });
  }

  private addRow(id?: number): void {
    let dataKey: any = [];
    let data: any = {};

    this.cols.forEach((col: any) => {
      dataKey.push({ field: col.field, type: col.editType });
      data[col.field] = '';
    })

    const dialogRef = this.dialog.open(AddRowComponent, {
      width: '300px',
      data: { data, dataKey }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.addRowApi(result, this.rowIndex, id);
    });
  }

  public addRowApi(row: any, index: number, id?: number): void {
    const newRow = {
      duration: row?.duration,
      taskName: row?.taskName,
      priority: row?.priority,
      progress: row?.progress,
      startDate: new Date(row?.startDate).getTime(),
      endDate: new Date(row?.endDate).getTime(),
      approved: false
    };
    if (id) {
      this.apiService.createSubtask(id, newRow).subscribe(res => {
        res = res.task;
        this.updateData();
      })
      return;
    }

    this.apiService.createTask(newRow).subscribe(res => {
      res = res.task;
      this.treeGridObj.addRecord({
        taskID: res._id,
        taskName: res.taskName,
        priority: res.priority,
        approved: res.approved,
        startDate: new Date(res.startDate),
        endDate: new Date(res.endDate),
        duration: res.duration,
        progress: res.progress
      }, (index));
      setTimeout(() => {
        this.updateStyles();
      }, 5)

    });
  }

  private editStyles(): void {
    this.dialog.open(ColumnStylesFormComponent, { data: this.cols[this.editIndex], width: '350px' })
      .afterClosed()
      .pipe(
        first(),
        filter(res => Boolean(res))
      ).subscribe(res => {
      const newRow = { ...this.cols[this.editIndex], ...res };
      this.cols.splice(this.editIndex, 1);
      this.updateStyles();
      setTimeout(() => {
        this.cols.splice(this.editIndex, 0, newRow);
      }, 1)
    })
  }

  private chooseColumn(): void {
    const dialogRef = this.dialog.open(ChooseColumnsComponent, {
      width: '250px',
      data: { cols: this.cols, visible: this.visibleColumns }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.visibleColumns = result;
        this.test = !this.test;
      }
    });
  }

  private getFilterDuration(): void {
    this.filterDurationTemplate = {
      create: (args: { element: Element, column: Column }) => {
        let dd: HTMLInputElement = document.createElement('input');
        dd.id = 'duration';
        return dd;
      },
      write: (args: { element: Element, column: Column }) => {
        let dataSource: string[] = ['All', '0', '1', '3', '4', '5', '6', '8', '9'];
        const dropDownFilter = new DropDownList({
          dataSource: dataSource,
          value: 'All',
          change: (e: ChangeEventArgs) => {
            let valuenum: any = +e.value;
            let id: any = <string>dropDownFilter.element.id;
            let value: any = <string>e.value;
            if (value !== 'All') {
              this.treeGridObj.filterByColumn(id, 'equal', valuenum);
            } else {
              this.treeGridObj.removeFilteredColsByField(id);
            }
          }
        });
        dropDownFilter.appendTo('#duration');
      }
    }
  }

  private getFilterPriority(): void {
    this.filterPriorityTemplate = {
      create: (args: { element: Element, column: Column }) => {
        let dd: HTMLInputElement = document.createElement('input');
        dd.id = 'priority';
        return dd;
      },
      write: (args: { element: Element, column: Column }) => {
        let dataSource: string[] = ['All', 'Low', 'Normal', 'High', 'Critical'];
        const dropDownFilter = new DropDownList({
          dataSource: dataSource,
          value: 'All',
          change: (e: ChangeEventArgs) => {
            let id: any = <string>dropDownFilter.element.id;
            let value: any = <string>e.value;
            if (value !== 'All') {
              this.treeGridObj.filterByColumn(id, 'equal', value);
            } else {
              this.treeGridObj.removeFilteredColsByField(id);
            }
          }
        });
        dropDownFilter.appendTo('#priority');
      }
    }
  }

  public checker(event: any): void {
    setTimeout(() => {
      this.updateStyles();

      if (this.copy) {
        this.copyStyles(this.prevRowIndex);
      }
    }, 0);
  }

  public updateStyles(): void {
    this.cols.forEach((el, index) => {
      document.querySelectorAll(`td[aria-colindex="${index}"]`).forEach(cell => {
        cell.setAttribute('style',
          `background: ${el.backgroundColor || 'white'};
                font-size: ${el.fontSize || 14}px;
                color: ${el.color || 'black'};
                text-align: ${el.textAlign?.toLowerCase()};
                white-space: ${el.textWrap === 'off' ? 'nowrap' : 'normal'};
                text-overflow: ${el.textWrap === 'off' ? 'ellipsis' : 'clip'};`
        );
      })
    })
  }

  private copyStyles(index: number): void {
    if (index === -1) {
      this.updateStyles();
      return;
    }

    for (let i = 0; i < this.copyContent.length; i++) {
      const copyElements = this.treeGridObj.getRowByIndex(index + i).getElementsByTagName('td');

      for (let i = 0; i < copyElements.length; i++) {
        copyElements[i].setAttribute(
          'style',
          'background: pink; color: white; font-size: 14px'
        )
      }
    }
  }

  public getEditing(checker: boolean): any {
    return {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Dialog',
      newRowPosition: checker ? 'Child' : 'Below'
    };
  }

  public contextMenuOpen(args?: any): void {
    if (args?.rowInfo?.cell?.classList.contains('e-rowcell')) {
      args.cancel = true;
    }

    if (args.event.pointerType === 'mouse') {
      this.rowIndex = args.rowInfo.rowIndex;
    }

    if (args.column?.index >= 0) {
      this.editIndex = args.column?.index;
    }

    let elem: Element = args.event.target as Element;
    const fieldArray = this.treeGridObj.getColumnFieldNames();
    for (let i = 0; i < fieldArray.length; i++) {
      const headerName = this.treeGridObj.getColumnHeaderByField(fieldArray[i]);

      if (headerName.textContent === elem.textContent) {
        this.fieldName = fieldArray[i];
      }
    }
  }

  public contextMenuClick(args?: MenuEventArgs | any): void {
    const filter = 'filter';
    const sort = 'sort';
    const multiSelect = 'multiSelect';
    this.rowIndex = args.rowInfo?.rowData?.rowIndex || this.rowIndex;

    const mockContextMenu: any[] = [];
    if (this.dialogCheck) {
      this.dialogMenuItems.forEach(item => mockContextMenu.push(item));
    } else {
      this.batchMenuItems.forEach(item => mockContextMenu.push(item));
    }

    if (args?.item.id === 'chooseColumn') {
      this.chooseColumn();
    }

    if (args?.item.id === 'editRow') {
      this.treeGridObj.startEdit(this.treeGridObj.getRowByIndex(this.rowIndex));
    }

    if (args?.item.id === 'deleteRow') {
      this.treeGridObj.deleteRow(this.treeGridObj.getRowByIndex(args.rowInfo.rowIndex));
    }

    if (args?.item.id === 'addNextRow') {
      this.rowIndex = args.rowInfo.rowIndex;
      this.childRow = false;
      this.addRow();
    }

    if (args?.item.id === 'addChildRow') {
      this.rowIndex = args.rowInfo.rowIndex;
      this.childRow = true;
      this.addRow(args.rowInfo.rowData.taskID);
    }


    if (args?.item.id === filter) {
      mockContextMenu.forEach(item => {
        if (item.id === filter) {
          this.filter = !this.filter;
          item.text = `Filter: ${this.filter ? 'off' : 'on'}`;
        }
      })

      this.dialogMenuItems = mockContextMenu;
    }

    if (args?.item.id === 'styles') {
      this.editStyles();
    }

    if (args?.item.id === sort) {
      mockContextMenu.forEach(item => {
        if (item.id === sort) {
          this.sort = !this.sort;
          item.text = `MultiSort: ${this.sort ? 'off' : 'on'}`;
        }
      })

      this.dialogMenuItems = mockContextMenu;
    }

    if (args?.item.id === 'freeze') {
      if (this.freeze === this.treeGridObj.getColumnIndexByField(this.fieldName) + 1) {
        this.freeze = 0;
      } else {
        this.freeze = this.treeGridObj.getColumnIndexByField(this.fieldName) + 1;
      }

      mockContextMenu.forEach(item => {
        if (item.id === 'freeze') {
          item.text = `Freeze: ${this.freeze > 0 ? 'off' : 'on'}`;
        }
      })

      this.dialogMenuItems = mockContextMenu;
      setTimeout(() => {
        this.treeGridObj.refresh();
      }, 50)
    }

    if (args?.item.id === multiSelect) {
      mockContextMenu.forEach(item => {
        if (item.id === multiSelect) {
          if (this.selectionSettings.type === 'Multiple') {
            this.selectionSettings = { type: 'Single' };
          } else {
            this.selectionSettings = { type: 'Multiple' };
          }

          item.text = `Multi select: ${this.selectionSettings.type === 'Multiple' ? 'off' : 'on'}`;
        }
      })

      this.dialogMenuItems = mockContextMenu;
    }

    if (args?.item.id === 'addColumn') {
      this.addColumn();
    }

    if (args?.item.id === 'deleteColumn') {
      this.deleteColumn();
    }

    if (args?.item.id === 'customCopy') {
      this.copyContent = this.treeGridObj.getSelectedRecords();
      this.prevRowIndex = this.rowIndex;
      this.copy = true;
      this.cut = false;

      this.copyStyles(this.prevRowIndex);
    }

    if (args?.item.id === 'customCut') {
      this.copyContent = this.treeGridObj.getSelectedRecords();
      this.prevRowIndex = this.rowIndex;
      this.copy = true;
      this.cut = true;

      this.copyStyles(this.prevRowIndex);
    }

    if (args?.item.id === 'customPasteNext') {
      this.childRow = false;
      setTimeout(() => {
        this.paste();
      }, 10);
    }

    if (args?.item.id === 'customPasteChild') {
      this.childRow = true;
      setTimeout(() => {
        this.paste();
      }, 10);
    }
  }

  private paste(): void {
    if (this.copyContent.length) {
      if (this.cut) {
        let index = this.prevRowIndex;

        this.copyContent.forEach((content: any) => {
          this.treeGridObj.deleteRow(this.treeGridObj.getRowByIndex(index));
          index++;
        });

        setTimeout(() => {
          this.treeGridObj.refresh();
        }, 50);
      }

      if (this.cut) {
        setTimeout(() => {
          let diff = 0;
          let index = this.rowIndex;

          this.copyContent.forEach((content: any) => {
            this.addRowApi(content, (this.rowIndex > this.prevRowIndex ? (index + diff) - this.copyContent.length : index + diff))
            diff++;
            index++;
          });
        }, 60);
      } else {
        let diff = 0;
        let index = this.rowIndex;
        this.copyContent.forEach((content: any) => {
          this.addRowApi(content, index + diff)
          diff++;
          index++;
        });
      }
    }

    if (!this.childRow && this.cut) {
      setTimeout(() => {
        this.test = !this.test;
      }, 100)
    }

    if (this.childRow && !this.cut) {
      setTimeout(() => {
        this.test = !this.test;
      }, 100)
    }

    this.copy = false;
    this.cut = false;
    this.copyStyles(-1);
  }

  public onLoad() {
    this.updateStyles();

    if (this.copy) {
      this.copyStyles(this.prevRowIndex);
    }
  }

  public editRow(data: any): void {
    const task = {
      endDate: data.endDate.getTime(),
      startDate: data.startDate.getTime(),
      duration: data.duration,
      approved: data.approved,
      priority: data.priority,
      taskName: data.taskName,
      progress: data.progress
    };
    this.apiService.updateTask(data._id, task).subscribe();
  }

  public onActionComplete(event: any): any {
    if (event.requestType === 'delete') {
      this.deleteTaskApi(event.data);
    }
    switch (event.action) {
      case 'edit':
        this.editRow(event.data);
        break;
    }
  }

  public deleteTaskApi(tasks: any): void {
    tasks.forEach((el: any) => {
      this.apiService.deleteTask(el._id).subscribe()
    });
  }

  public updateData(): void {
    this.apiService.getAllRows()
      .pipe(
        map(res => res.map((el: any) => {
          return {
            ...el,
            taskID: el._id,
            startDate: new Date(el.startDate),
            endDate: new Date(el.endDate),
            ...(el.subtasks?.length && {
              subtasks: el.subtasks.map((subt: any) => {
                return {
                  ...subt,
                  taskID: subt._id,
                  startDate: new Date(subt.startDate),
                  endDate: new Date(subt.endDate)
                }
              })
            })
          }
        }))
      )
      .subscribe(res => this.data = res);
  }
}
