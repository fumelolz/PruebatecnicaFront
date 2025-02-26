import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/ApiResponse.interface';
import { PagedList } from '../interfaces/PagedListResponse.interface';
import { User } from '../models/users/User.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<ApiResponse<PagedList<User>>> {
    return this.http.get<ApiResponse<PagedList<User>>>(
      environment.api.concat('users')
    );
  }

  getOneById(id: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(
      environment.api.concat(`users/${id}`)
    );
  }
}
