import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';                                                                       // Importa o módulo de formulários para usar recursos como ngModel
import { CommonModule } from '@angular/common';                                                                     // Importa o módulo comum que contém diretivas básicas como ngIf e ngFor
import { Router } from '@angular/router';

import { ApiService } from '../../../services/api.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-delete',
  imports: [CommonModule, FormsModule],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.scss'
})
export class DeleteComponent {
  userIdToSearch!: number;
  searched: boolean = false;
  user!: User
  showConfirmation: boolean = false;
  errorMessage!: string;
  successMessage!: string;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  searchUser(): void {
    if (this.userIdToSearch) {
      this.apiService.getUserById(this.userIdToSearch).subscribe({
        next: (user: User) => {                                                                                       // Função chamada quando os dados são recebidos com sucesso. O objeto entre parêntesis representa a resposta da API.
          this.user = user;                                                                                           // Passa os valores do usuário recebidos da API para o objeto user, que é uma propriedade desta classe.
          this.searched = true;
        },
        error: (error: any) => {
          console.error('Erro ao carregar usuário!', error);
          this.searched = true;                                                                                        // Booleano que marca que a busca foi feita. Ele é importante para poder mostrar uma mensagem que o usuário não foi encontrado.
        }

      });

    }

  }

  showDeleteConfirmation(): void {
    if (this.userIdToSearch === 1) {                                                                                  // Verifica se o ID do usuário é 1 (protegido contra exclusão)
      this.errorMessage = 'O usuário com ID 1 não pode ser excluído! Os demais podem ser excluídos.';
    } else { this.showConfirmation = true; }
  }

  confirmDelete(): void {
    this.apiService.deleteUser(this.userIdToSearch).subscribe({
      next: () => {                                                                                                   // Função chamada quando a exclusão é bem-sucedida
        this.showConfirmation = false;                                                                                // Esconde a confirmação de exclusão
        this.successMessage = 'Usuário excluído com sucesso!';
        setTimeout(() => {                                                                                            // Define um temporizador para redirecionar após 2 segundos
          this.router.navigate(['/view-all']);
        }, 2000);
      },
      error: (error: any) => {
        console.error('Erro ao excluir usuário', error);
        this.showConfirmation = false;                                                                                // Esconde a confirmação de exclusão
        this.errorMessage = 'Erro ao excluir usuário.';
      }

    })

  }

  cancelDelete(): void {                                                                                              // Método que cancela a operação e esconde a confirmação de exclusão.
    this.showConfirmation = false;
  }

}
