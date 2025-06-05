import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  private router: Router = new Router;

  goToCreate() {
    this.router.navigate(['/create'])
  }

  goToDelete() {
    this.router.navigate(['/delete'])
  }

  goToUpdate() {
    this.router.navigate(['/update'])
  }

  goToView() {
    this.router.navigate(['/view'])
  }

  goToViewAll() {
    this.router.navigate(['/view-all'])
  }

}
