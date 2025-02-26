import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { LoaderComponent } from './components/loader/loader.component';
import { NamePipe } from './pipes/name.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputErrorDirective } from './directives/input-error.directive';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [
    LoaderComponent,
    NamePipe,
    InputErrorDirective,
    ConfirmationDialogComponent,
  ],
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, FormsModule],
  exports: [
    CommonModule,
    MaterialModule,
    LoaderComponent,
    NamePipe,
    InputErrorDirective,
  ],
})
export class SharedModule {}
