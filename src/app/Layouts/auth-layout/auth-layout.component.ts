import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faFacebook , faGoogle , faLinkedin , faGithub } from '@fortawesome/free-brands-svg-icons';
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet , RouterLink , FontAwesomeModule ,NgFor,NgIf,NgClass],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {
  faFacebook= faFacebook;
  faGoogle=faGoogle
  faGithub=faGithub
 faLinkedin=faLinkedin
 currentTab: string = 'login';
  showLayout: boolean = false;


  constructor(public router: Router ) {}
  ngOnInit() {
    this.showLayout = true;
    // this.router.navigate(['/auth/login']);
  }

  toggleTab(tab: string) {
    this.currentTab = tab;
    this.router.navigate([`/auth/${tab}`]);
  }


}
