import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { User } from '../../../models/user';
import { ApiService } from '../../../services/api.service';


@Component({
  selector: 'app-create',
  imports: [
    CommonModule,                                                                                         // Importação necessária para poder usar as diretivas básicas ngIf e ngFor.
    ReactiveFormsModule
  ],                                                                                                      // ReactiveFormsModule → necessário para conectar o formulário do html com este arquivo TypeScipt.
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})

export class CreateComponent implements OnInit{
  userForm!: FormGroup;                                                                                   // objeto que receberá os valores do formulário reativo. " ! " indica inicialização posterior, ou seja, ele receberá os valores depois, não nesta linha de código.
  successMessage!: string;
  errorMessage!: string;

  constructor (                                                                                           // Constructor → Ele tem a função DI (Dependency Injection - Injeção de Dependência), ou seja, é aqui que colocamos os objetos de outras classes que iremos precisar nesta classe.
    private apiService: ApiService,
    private router: Router
  ){}

  ngOnInit(): void {                                                                                      // Método que faz com que tudo que estiver aqui dentro seja executado assim que a página for carregada.
    this.initForm();
  }

  initForm(): void {
    this.userForm = new FormGroup({                                                                       // Significa que o que for escrito nos inputs do formulário HTML será armazenado no objeto userForm. Ele usa a abordagem de formulários reativos, sendo possível graças a importação do ReactiveFormsModule.
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

  onSubmit(): void {
    this.errorMessage = '';                                                                                                 // Ação necessária para apagar a mensagem de erro da chamada anterior.

    if (this.userForm.valid) {
      const user: User = this.userForm.value;
      this.apiService.createUser(user).subscribe({                                                                          // .subscribe() → é um método necessário por que o resultado do método .createUser(user) é um Observable <User>, ou seja, ele não vem na hora que é chamado, pois depende da resposta da API, então o método .subscribe() fica tipo na escuta, esperando atento a chegada da resposta da API.
        next: () => {                                                                                                       // Função chamada quando a criação é bem-sucedida
          this.successMessage = 'Usuário criado com sucesso!';
          setTimeout(() => {                                                                                                // Define um temporizador para redirecionar após 2 segundos
            this.router.navigate(['/view-all']);                                                                            // Navega para a página de visualização de todos os usuários, após 2 segundos.
          }, 3000);
        },
        error: (error) => {                                                                                                 // Função chamada quando ocorre um erro
          if (error.error && typeof error.error === 'string') {                                                             // Verifica o tipo de erro baseado na resposta da API tem uma propriedade error que é uma string
            if (error.error.includes('conta') || error.error.toLowerCase().includes('account')) {                           // Verifica se na mensagem de erro tem a palavra conta ou account.
              this.errorMessage = 'Número de conta já existe!';
            } else if (error.error.includes('cartão') || error.error.toLowerCase().includes('card')) {                      // Verifica se na mensagem de erro tem a palavra cartão ou card.
              this.errorMessage = 'Número de cartão já existe!';
            } else {
              this.errorMessage = 'Erro ao criar usuário. Tente novamente mais tarde.';                                     // Define uma mensagem de erro genérica
            }
          } else {                                                                                                          // Se o erro não tiver uma propriedade error que é uma string
            this.errorMessage = 'Erro ao criar usuário. Tente novamente mais tarde.';                                       // Define uma mensagem de erro genérica
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

}











