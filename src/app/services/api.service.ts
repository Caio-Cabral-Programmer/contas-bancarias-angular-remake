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

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  deleteUser(id: number): Observable<void> {                                                                     // Método que recebe um ID e retorna um Observable vazio após a exclusão
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: number, user: User): Observable<User> {                                                         // Método que recebe um ID e um objeto User e retorna um Observable com o usuário atualizado
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);                                                    // Faz uma requisição PUT para atualizar um usuário existente no servidor
  }

  getAllUsers(): Observable<User[]> {                                                                            // Método que retorna um Observable com um array de usuários
    return this.http.get<User[]>(this.apiUrl);                                                                   // Faz uma requisição GET para obter todos os usuários do servidor
  }

}


