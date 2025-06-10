import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';                                                                       // Importa o módulo de formulários para usar recursos como ngModel
import { CommonModule } from '@angular/common';                                                                     // Importa o módulo comum que contém diretivas básicas como ngIf e ngFor

import { ApiService } from '../../../services/api.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-view',
  imports: [CommonModule, FormsModule],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  userIdToSearch!: number;
  user: User | null = null;
  errorMessage!: string;


  constructor(
    private apiService: ApiService,
  ) { }

  searchUser(): void {
    this.errorMessage = '';
    this.user = null;

    if (this.userIdToSearch) {
      this.apiService.getUserById(this.userIdToSearch).subscribe({
        next: (user: User) => {                                                                                       // Função chamada quando os dados são recebidos com sucesso. O objeto entre parêntesis representa a resposta da API.
          this.user = user;                                                                                           // Passa os valores do usuário recebidos da API para o objeto user, que é uma propriedade desta classe.
        },
        error: (error: any) => {
          console.error('Erro ao carregar usuário!', error);
          this.errorMessage = 'Usuário não encontrado!';
        }

      });

    }

  }

}
