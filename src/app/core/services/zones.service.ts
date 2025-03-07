import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Zonefilters } from '../models/zones/ZoneFilters.interface';
import { ApiResponse } from '../interfaces/ApiResponse.interface';
import { PagedList } from '../interfaces/PagedListResponse.interface';
import { Zone } from '../models/zones/Zone.model';
import { environment } from '../../../environments/environment';
import * as signalR from '@microsoft/signalr';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root',
})
export class ZonesService {
  private hubConnection!: signalR.HubConnection;
  public isManuallyDisconnected = false;
  private statusScrapper = new BehaviorSubject<{
    message: string;
    year: number;
  }>({ message: '', year: 0 });
  statusScrapper$ = this.statusScrapper.asObservable();
  constructor(
    private readonly http: HttpClient,
    private readonly _authSevice: AuthService
  ) {}

  startConnection(): void {
    if (
      this.hubConnection &&
      this.hubConnection.state === signalR.HubConnectionState.Connected
    ) {
      console.log('SignalR ya está conectado.');
      return;
    }

    if (this.isManuallyDisconnected) {
      console.log(
        '❌ La conexión de SignalR fue detenida manualmente, no se volverá a conectar.'
      );
      return;
    }

    this.initSignalRConnection();
  }

  private initSignalRConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7070/hubs/notifications')
      .withAutomaticReconnect([0, 2000, 5000, 10000]) // Intentos de reconexión en milisegundos
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('✅ SignalR conectado');
        this.registerClient();
      })
      .catch((err) => console.error('❌ Error en SignalR:', err));

    this.hubConnection.on(
      'JobCompleted',
      (response: { message: string; year: number }) => {
        console.log('📡 Job completado:', response);
        this.statusScrapper.next(response);
      }
    );

    // Cuando la conexión se pierde y se intenta reconectar
    this.hubConnection.onreconnecting((error) => {
      console.warn('🔄 Intentando reconectar SignalR...', error);
    });

    this.hubConnection.onreconnected((connectionId) => {
      console.log(`✅ Reconectado a SignalR con ID: ${connectionId}`);
      this.registerClient();
    });

    this.hubConnection.onclose((error) => {
      console.error('❌ SignalR cerrado permanentemente:', error);
      setTimeout(() => this.startConnection(), 5000);
    });
  }

  private registerClient(): void {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection
        .invoke('RegisterClient', this._authSevice.user.userId)
        .then(() => console.log('📡 Cliente registrado en SignalR'))
        .catch((err) => console.error('❌ Error registrando el cliente:', err));
    }
  }

  stopConnection(): void {
    if (this.hubConnection) {
      this.isManuallyDisconnected = true; // Marcamos que la desconexión fue intencional
      this.hubConnection
        .stop()
        .then(() => console.log('🛑 SignalR desconectado'))
        .catch((err) => console.error('Error al detener SignalR:', err));
    }
  }

  getData(year: number, update: boolean): Observable<void> {
    return this.http.get<void>(environment.api.concat('scraper'), {
      params: { userId: this._authSevice.user.userId, year, update },
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
