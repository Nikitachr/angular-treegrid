import { IColumnAttributes } from 'src/app/interfaces/column-attributes.interface';

export const defaultColumns: Partial<IColumnAttributes>[] = [
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
    format: 'yMd',
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
  }
]
