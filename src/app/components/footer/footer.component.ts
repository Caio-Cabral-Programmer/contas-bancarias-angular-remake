import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  copyEmail() {
    navigator.clipboard.writeText('caiocabral.ep@gmail.com').then(() => {                 // Usa a API Clipboard para copiar o texto para a área de transferência
      alert('Email copiado para a área de transferência!');                               // Mostra um alerta informando que o email foi copiado com sucesso
    });
  }

}
