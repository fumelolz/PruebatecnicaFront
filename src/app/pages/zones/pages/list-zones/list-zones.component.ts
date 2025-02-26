import { Component, signal } from '@angular/core';
import { User } from '../../../../core/models/users/User.model';
import { UserService } from '../../../../core/services/user.service';
import { ZonesService } from '../../../../core/services/zones.service';
import { Zone } from '../../../../core/models/zones/Zone.model';
import { PageEvent } from '@angular/material/paginator';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogService } from '../../../../core/services/confirmation-dialog.service';
import { Zonefilters } from '../../../../core/models/zones/ZoneFilters.interface';
import { AuthService } from '../../../../core/services/auth.service';
@Component({
  selector: 'app-list-zones',
  templateUrl: './list-zones.component.html',
  styleUrl: './list-zones.component.scss',
})
export class ListZonesComponent {
  searchSig = signal<string>('');
  displayedColumns: string[] = [
    'Zona',
    'Anio',
    'Participante',
    'SubCuenta',
    'CapacidadDemandada',
    'RequisitoAnual',
    'ValorDelRequisitoAnual',
  ];
  zones: Zone[] = [];
  year = 2024;
  yearSelected: number | null = null;
  sortColumn = 'name';
  sortOrder = 'desc';
  minCapacity = 0;
  maxCapacity = 100;
  isLoading = false;

  // Paginador
  totalItems = 0;
  page = 1;
  pageSize = 10;
  constructor(
    private readonly _zonesService: ZonesService,
    private readonly _snackBar: MatSnackBar,
    private readonly _confirmationDialogService: ConfirmationDialogService,
    public readonly authService: AuthService
  ) {
    toObservable(this.searchSig)
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.getZones();
      });
  }

  ngOnInit(): void {
    this.getZones();
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }

  onDragEnd(event: any, thumb: 'start' | 'end'): void {
    if (thumb === 'start') {
      this.minCapacity = event.value;
    }
    if (thumb === 'end') {
      this.maxCapacity = event.value;
    }
    this.getZones();
  }

  sortChange($event: { active: string; direction: 'asc' | 'desc' | '' }): void {
    switch ($event.active) {
      case 'Zona':
        this.sortColumn = 'name';
        break;
      case 'Anio':
        this.sortColumn = 'anio';
        break;
      case 'Participante':
        this.sortColumn = 'participant';
        break;
      case 'SubCuenta':
        this.sortColumn = 'subaccount';
        break;
      case 'CapacidadDemandada':
        this.sortColumn = 'capacidadDemandada';
        break;
      case 'RequisitoAnual':
        this.sortColumn = 'requisitoAnualDePotencia';
        break;
      case 'ValorDelRequisitoAnual':
        this.sortColumn = 'valorDelRequisitoAnualEficiente';
        break;
    }
    if ($event.direction !== '') {
      this.sortOrder = $event.direction;
    } else {
      this.sortColumn = 'name';
      this.sortOrder = 'desc';
    }
    this.getZones();
  }

  selectYear($event: any): void {
    const target = $event.target as HTMLSelectElement;
    this.yearSelected = Number(target.value);
    this.getZones();
  }
  search(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchSig.set(value);
  }

  changePage($event: PageEvent): void {
    this.page = $event.pageIndex + 1;
    this.pageSize = $event.pageSize;
    this.getZones();
  }
  Getdata(year: number): void {
    this._zonesService.checkIfYearExist(year).subscribe({
      next: (response) => {
        if (response.data) {
          this.openModal(year);
        } else {
          this.setZones(year, false);
        }
      },
    });
  }

  setZones(year: number, update: boolean): void {
    this._zonesService.getData(year, update).subscribe({
      next: (response) => {
        this._snackBar.open(
          'Información Obtenida correctamente, recargando la tabla',
          '',
          {
            duration: 3000,
          }
        );
        this.getZones();
      },
    });
  }

  openModal(year: number): void {
    this._confirmationDialogService
      .confirm(
        'Ya existe información',
        'Ya existe información con el año proporcionado. \n¿Quieres volver a actualizar la base de datos?',
        'Sí',
        'No'
      )
      .subscribe((result) => {
        if (result) {
          this.setZones(year, result);
        }
      });
  }

  getZones(): void {
    this.isLoading = true;
    const filters: Zonefilters = {
      minCapacity: this.minCapacity,
      maxCapacity: this.maxCapacity,
      searchTerm: this.searchSig().trim(),
      page: this.page,
      pageSize: this.pageSize,
      sortColumn: this.sortColumn,
      sortOrder: this.sortOrder,
    };

    if (this.yearSelected) {
      filters.year = this.yearSelected;
    }
    this._zonesService.getZones(filters).subscribe({
      next: (response) => {
        this.zones = response.data.items;
        this.totalItems = response.data.totalCount;
        this.isLoading = false;
      },
    });
  }
}
