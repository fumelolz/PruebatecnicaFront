import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListUserRoutingModule } from './list-user-routing.module';
import { ListUserComponent } from './list-user.component';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [ListUserComponent],
  imports: [CommonModule, ListUserRoutingModule, SharedModule],
})
export class ListUserModule {}
