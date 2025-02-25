import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZonesComponent } from './zones.component';
import { ListZonesComponent } from './pages/list-zones/list-zones.component';

const routes: Routes = [
  {
    path: '',
    component: ZonesComponent,
    children: [
      {
        path: '',
        component: ListZonesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZonesRoutingModule {}
