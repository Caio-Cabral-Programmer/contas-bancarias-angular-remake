import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';                                                                           // Importa o módulo comum que contém diretivas básicas como ngIf e ngFor
import { Router } from '@angular/router';

import { ApiService } from '../../../services/api.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-update',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss'
})
export class UpdateComponent implements OnInit{
  userIdToSearch!: number;
  user: User | null = null;
  userForm!: FormGroup;                                                                                                   // objeto que receberá os valores do formulário reativo. " ! " indica inicialização posterior, ou seja, ele receberá os valores depois, não nesta linha de código.
  errorMessage!: string;
  successMessage!: string;
  showConfirmation: boolean = false;
  accountId: number | null = null;                                                                                        // Variável para armazenar o ID da conta que vem da API.
  cardId: number | null = null;                                                                                           // Variável para armazenar o ID do cartão que vem da API.



  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {                                                                                                      // Método que faz com que tudo que estiver aqui dentro seja executado assim que a página for carregada.
    this.initForm();
  }

  initForm(): void {
    this.userForm = new FormGroup({                                                                                       // Significa que o que for escrito nos inputs do formulário HTML será armazenado no objeto userForm. Ele usa a abordagem de formulários reativos, sendo possível graças a importação do ReactiveFormsModule.
      name: new FormControl('', Validators.required),
      account: new FormGroup({
        number: new FormControl('', Validators.required),
        agency: new FormControl('', Validators.required),
        balance: new FormControl(0, Validators.required),
        limit: new FormControl(0, Validators.required)
      }),
      card: new FormGroup({
        number: new FormControl('', Validators.required),
        limit: new FormControl(0, Validators.required)
      })
    });

  }

  searchUser(): void {
    this.errorMessage = '';
    this.user = null;

    if (this.userIdToSearch) {
      this.apiService.getUserById(this.userIdToSearch).subscribe({
        next: (user: User) => {                                                                                            // Função chamada quando os dados são recebidos com sucesso. O objeto entre parêntesis representa a resposta da API.
          this.user = user;                                                                                                // Passa os valores do usuário recebidos da API para o objeto user, que é uma propriedade desta classe.
          this.accountId = user.account?.id || null;                                                                       // Passa o valor do ID da conta que vem da API para a variável accountId. Será utilizado para fazer o PUT para a API.
          this.cardId = user.card?.id || null;                                                                             // Passa o valor do ID do cartão que vem da API para a variável cardId. Será utilizado para fazer o PUT para a API.

          const formattedUser = {                                                                                          // Variável importante que recebe todos os dados do usuário que veio da API.
            id: user.id || this.userIdToSearch,
            name: user.name || '',
            account: {
              id: user.account?.id || null,  // Usa o ID da conta
              number: user.account?.number || '',
              agency: user.account?.agency || '',
              balance: user.account?.balance || 0,
              limit: user.account?.limit || 0
            },
            card: {
              id: user.card?.id || null,  // Usa o ID do cartão
              number: user.card?.number || '',
              limit: user.card?.limit || 0
            }
          };

          this.userForm.patchValue(formattedUser);                                                                          // Passa todos os dados da variável formattedUser para o objeto userForm, fazendo com que os valores do formulário sejam atualizados com os valores do usuário que veio da API.
                                                                                                                            // Infelizemente os IDs não estão sendo passados para o userForm, porque não tem esses campos no formulário. Por isso precisamos criar variáveis para os IDs (this.accountId e this.cardId) para receber os IDs da API para depois podermos fazer o PUT corretamente. Para o ID do usuário usaremos esta variável this.userIdToSearch.
        },
        error: (error: any) => {
          console.error('Erro ao carregar usuário!', error);
          this.errorMessage = 'Usuário não encontrado!';
        }

      });

    }

  }

  showUpdateConfirmation(): void {
    if (this.userIdToSearch === 1) {                                                                                         // Verifica se o ID do usuário é 1 (protegido contra exclusão)
      this.errorMessage = 'O usuário com ID 1 não pode ser atualizado!';
    } else { this.showConfirmation = true; }
  }

  onSubmit(): void {
    if (this.userForm.valid) {

      const formValue = this.userForm.value;                                                                                 // Variável formValue necessária para receber os valores do objeto userForm, pois não estava funcionando passar os valores de userForm direto para a variável updatedUser.

      const updatedUser: User = {                                                                                            // Aqui estamos criando um objeto User (updatedUser) com a estrutura correta com todos os IDs para que o JSON enviado para API contenha todos os IDs para que o update ocorra com sucesso. O formulário não inclue os IDs, por isso precisamos incluí-los manualmente.
        id: this.userIdToSearch,                                                                                             // Precisei usar esta variável this.userIdToSearch porque o TS não estava reconhecendo o ID do usuário da API, ou seja user.id estava vindo como NULL.
        name: formValue.name,
        account: {
          id: formValue.account.id || this.accountId,                                                                        // O que estava acontecendo: O ID do userToUpdate da API estava indo como NULL (sendo portanto, diferente do ID do usuário do Banco de dados) e os números da conta e do cartão estavam acusando como se já existissem no banco de dados.
          number: formValue.account.number,
          agency: formValue.account.agency,
          balance: formValue.account.balance,
          limit: formValue.account.limit
        },
        card: {
          id: formValue.card.id || this.cardId,
          number: formValue.card.number,
          limit: formValue.card.limit
        }
      };

      this.apiService.updateUser(this.userIdToSearch, updatedUser).subscribe({                                              // .subscribe() → é um método necessário por que o resultado do método .createUser(user) é um Observable <User>, ou seja, ele não vem na hora que é chamado, pois depende da resposta da API, então o método .subscribe() fica tipo na escuta, esperando atento a chegada da resposta da API.
        next: () => {                                                                                                       // Função chamada quando a criação é bem-sucedida
          this.successMessage = 'Usuário atualizado com sucesso!';
          setTimeout(() => {                                                                                                // Define um temporizador para redirecionar após 2 segundos
            this.router.navigate(['/view-all']);                                                                            // Navega para a página de visualização de todos os usuários, após 2 segundos.
          }, 2000);
        },
        error: (error) => {                                                                                                 // Função chamada quando ocorre um erro
          if (error.error && typeof error.error === 'string') {                                                             // Verifica o tipo de erro baseado na resposta da API tem uma propriedade error que é uma string
            if (error.error.includes('conta') || error.error.toLowerCase().includes('account')) {                           // Verifica se na mensagem de erro tem a palavra conta ou account.
              this.errorMessage = 'Número de conta já existe!';
            } else if (error.error.includes('cartão') || error.error.toLowerCase().includes('card')) {                      // Verifica se na mensagem de erro tem a palavra cartão ou card.
              this.errorMessage = 'Número de cartão já existe!';
            } else {
              this.errorMessage = 'Erro ao atualizar usuário. Tente novamente mais tarde.';                                     // Define uma mensagem de erro genérica
            }
          } else {                                                                                                          // Se o erro não tiver uma propriedade error que é uma string
            this.errorMessage = 'Erro ao atualizar usuário. Tente novamente mais tarde.';                                       // Define uma mensagem de erro genérica
          }
        }
      });
    } else {                                                                                                                // Se o formulário não for válido
      this.markFormGroupTouched(this.userForm);                                                                             // Marca todos os campos como tocados para mostrar erros de validação
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {                                                                              // Método auxiliar para marcar todos os controles como tocados, ele recebe um grupo de formulário como entrada.
    Object.values(formGroup.controls).forEach(control => {                                                                  // Pense nisso como abrir a caixa de formulário que você recebeu e pegar todos os "controles" (que são como os campos de texto, números, etc.) que estão diretamente dentro dela, e então, para cada um desses controles, fazer algo.
      control.markAsTouched();                                                                                              // Esta linha é como "tocar" no controle atual. Ela diz para o Angular: "Este campo foi tocado pelo usuário (ou pelo nosso ajudante aqui)!". Isso é importante para que o Angular saiba quando mostrar mensagens de erro de validação para campos obrigatórios que estão vazios. Contexto Angular: No Angular, um campo de formulário tem um estado touched (tocado). Ele é false por padrão e se torna true quando o usuário interage com o campo (clica nele e sai, ou digita algo). Muitas mensagens de erro de validação (<div *ngIf="myForm.get('fieldName').invalid && myForm.get('fieldName').touched">) só aparecem se o campo estiver invalid E touched.
      if ((control as any).controls) {                                                                                      // Aqui, o ajudante verifica se o controle atual que ele está olhando é, na verdade, uma outra "caixinha" de formulário (um FormGroup aninhado, como as caixas de conta ou cartão). Ele usa '(control as any).controls' porque nem todo controle tem outros controles dentro, só os grupos. control as any: Uma "jogada" de TypeScript. control é do tipo AbstractControl, que é um tipo genérico e não sabe se tem a propriedade controls (que é exclusiva de um FormGroup ou FormArray). Ao usar as any, estamos temporariamente "desligando" a verificação de tipo do TypeScript para essa parte específica para verificar se control realmente tem a propriedade controls.
        this.markFormGroupTouched(control as FormGroup);                                                                    // Se o controle atual for uma caixinha (um FormGroup), o ajudante chama a si mesmo de novo, mas agora para essa caixinha menor! Isso é chamado de "recursão", é como um espelho que reflete outro espelho, permitindo que ele vá fundo em todas as caixinhas dentro das caixinhas até tocar em todos os campos.
      }                                                                                                                     // Na verdade, este método nunca será chamado, porque o botão submit está com essa marcação [disabled]="!userForm.valid".
    });
  }

  cancelUpdate(): void {                                                                                                    // Método que cancela a operação e esconde a confirmação de atualização.
    this.showConfirmation = false;
  }
}
