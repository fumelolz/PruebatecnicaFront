import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZonesRoutingModule } from './zones-routing.module';
import { ListZonesComponent } from './pages/list-zones/list-zones.component';
import { SharedModule } from '../../shared/shared.module';
import { ZonesComponent } from './zones.component';

@NgModule({
  declarations: [ZonesComponent, ListZonesComponent],
  imports: [CommonModule, ZonesRoutingModule, SharedModule],
})
export class ZonesModule {}
