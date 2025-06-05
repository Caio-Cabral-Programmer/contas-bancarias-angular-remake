import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent  {

  private router: Router = new Router;

  goToMenu() {
    this.router.navigate(['/menu'])
  }

  goToHome() {
    this.router.navigate(['/home'])
  }

}
