import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuModule } from 'primeng/menu';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    SelectModule,
    DialogModule,
    CardModule,
    DatePickerModule,
    ToolbarModule,
    ToastModule,
    FileUploadModule,
    PanelMenuModule,
    MenuModule
  ],
  exports: [
    CommonModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    SelectModule,
    DialogModule,
    CardModule,
    DatePickerModule,
    ToolbarModule,
    ToastModule,
    FileUploadModule,
    PanelMenuModule,
    MenuModule
  ]
})
export class PrimengModule { }
