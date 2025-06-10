import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';                                                                     // Importa o módulo comum que contém diretivas básicas como ngIf e ngFor

import { ApiService } from '../../../services/api.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-view-all',
  imports: [CommonModule],
  templateUrl: './view-all.component.html',
  styleUrl: './view-all.component.scss'
})
export class ViewAllComponent implements OnInit{
  users: User[] = [];                                                                                               // Propriedade para armazenar a lista de usuários que virá da API. Ela começa vazia.
  loading: boolean = false;                                                                                         // Propriedade que controlará a visualização do aviso de carregamento. Começa como false (não está carregando).
  searched: boolean = false;

  constructor(
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {                                                                                                // Método que é executado quando o componente é inicializado
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;                                                                                            // Define loading como true para mostrar um indicador de carregamento
    this.searched = true;                                                                                        // Booleano que marca que a busca foi feita. Ele é importante para poder mostrar uma mensagem que o usuário não foi encontrado.

    this.apiService.getAllUsers().subscribe({
      next: (users: User[]) => {
        setTimeout(() => {                                                                                          // Define um temporizador para realizar as ações seguintes após 2 segundos.
          this.loading = false;                                                                                     // Define loading como false para esconder o indicador de carregamento
          this.users = users;                                                                                       // Armazena a lista de usuários recebida na propriedade users desta classe.
        }, 2000);
      },
      error: (error: any) => {
        console.error('Erro ao carregar usuários', error);
        this.loading = false;
      }
    });
  }

}


