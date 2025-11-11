import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from "./shared/layouts/header/header";
import { Footer } from "./shared/layouts/footer/footer";
import { filter } from 'rxjs';


@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})


export class App {
  protected readonly title = signal('CarService');

  showLayout = true;

  constructor(private router: Router) {

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {

      const url = event.urlAfterRedirects || event.url;

      const hideOn = ['/login', '/register', '/forgot-password'];
      this.showLayout = !hideOn.some(path => url.startsWith(path)) && !url.startsWith('/admin');
    });
  }
}
