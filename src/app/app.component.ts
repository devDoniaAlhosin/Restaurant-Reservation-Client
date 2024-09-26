import { Component } from '@angular/core';
import { NavigationEnd, RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './Shared/components/navbar/navbar.component';
import { FooterComponent } from './Shared/components/footer/footer.component';
import { BookingComponent } from './Pages/booking/booking.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent,BookingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Client';

  constructor(private router: Router) {}
  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }
}
