import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ZonesService {
  constructor(private readonly http: HttpClient) {}

  getData(): Observable<void> {
    return this.http.get<void>('https://localhost:7070/api/Scraper?year=2022');
  }
  getZones() {
    return this.http.get('https://api.weatherapi.com/v1/search.json');
  }
}
