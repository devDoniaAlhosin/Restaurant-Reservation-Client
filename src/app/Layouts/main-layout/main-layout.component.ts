import { Component } from '@angular/core';
import { NavbarComponent } from '../../Shared/components/navbar/navbar.component';
import { FooterComponent } from '../../Shared/components/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { ScrollUpBtnComponent } from '../../Shared/components/scroll-up-btn/scroll-up-btn.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent , ScrollUpBtnComponent] ,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {}
