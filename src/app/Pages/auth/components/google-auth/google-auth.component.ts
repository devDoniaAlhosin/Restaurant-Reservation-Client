import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../Core/services/userService/user.service';
import { AuthService } from '../../../../Core/auth/auth.service';
import {faFacebook , faGoogle , faLinkedin , faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-google-auth',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './google-auth.component.html',
  styleUrl: './google-auth.component.css'
})
export class GoogleAuthComponent {
  faGoogle=faGoogle
  constructor(
    public router: Router,
    private authService: AuthService,
    private userService :UserService,
    private route: ActivatedRoute){

    }
    @Input() buttonText: string = 'Sign In';
    private apiUrl = 'http://localhost:8000/api';

    login() {
      window.open(`${this.apiUrl}/auth/google/redirect`, '_self');
    }

}
