import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) { }                                                                      // Construtor que recebe uma instância de HttpClient para fazer requisições HTTP

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

}


