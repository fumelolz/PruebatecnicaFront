import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Zonefilters } from '../models/zones/ZoneFilters.interface';
import { ApiResponse } from '../interfaces/ApiResponse.interface';
import { PagedList } from '../interfaces/PagedListResponse.interface';
import { Zone } from '../models/zones/Zone.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ZonesService {
  constructor(private readonly http: HttpClient) {}

  getData(year: number, update: boolean): Observable<void> {
    return this.http.get<void>(environment.api.concat('scraper'), {
      params: { year, update },
    });
  }
  getZones(
    filters: Zonefilters = {}
  ): Observable<ApiResponse<PagedList<Zone>>> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });
    return this.http.get<ApiResponse<PagedList<Zone>>>(
      environment.api.concat('zones'),
      { params }
    );
  }

  checkIfYearExist(year: number): Observable<ApiResponse<boolean>> {
    return this.http.get<ApiResponse<boolean>>(
      environment.api.concat('zones/checkYear'),
      {
        params: { year: year.toString() },
      }
    );
  }
}
