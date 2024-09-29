import { AuthService } from './../../Core/auth/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ScrollAnimationDirective } from '../../Shared/directives/scrollAnimation/scroll-animation.directive';
import {
  faMugSaucer,
faUtensils,
faMugHot,
faGlassWater,
faStroopwafel,
faPhone,
faLocationDot,
faMessage,
faEnvelope,
faMapMarkedAlt,
faCartShopping,
faPercent

} from '@fortawesome/free-solid-svg-icons';

import {
 faClock

} from '@fortawesome/free-regular-svg-icons';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule , NgIf ,  NgFor,ScrollAnimationDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  services = [
    {
      title: 'Caterings',
      description: 'In the new era of technology we look in the future with certainty for life.',
      image: 'assets/img/catering.png'
    },
    {
      title: 'Birthdays',
      description: 'In the new era of technology we look in the future with certainty for life.',
      image: 'assets/img/birthdays.png'
    },
    {
      title: 'Weddings',
      description: 'In the new era of technology we look in the future with certainty for life.',
      image: 'assets/img/wedding.png'
    },
    {
      title: 'Events',
      description: 'In the new era of technology we look in the future with certainty for life.',
      image: 'assets/img/events.png'
    }
  ];
  testimonials = [
    {
      title: "The best restaurant",
      content: "Last night, we dined at place and were simply blown away. From the moment we stepped in, we were enveloped in an inviting atmosphere and greeted with warm smiles.",
      author: "Sophie Robson",
      location: "Los Angeles, CA",
      image: "../../../assets/img/p1.png"
    },
    {
      title: "Simply delicious",
      content: "Place exceeded my expectations on all fronts. The ambiance was cozy and relaxed, making it a perfect venue for our anniversary dinner. Each dish was prepared and beautifully presented.",
      author: "Matt Cannon",
      location: "San Diego, CA",
      image: "../../../assets/img/p2.png"
    },
    {
      title: "One of a kind restaurant",
      content: "Place exceeded my expectations on all fronts. The ambiance was cozy and relaxed, making it a perfect venue for our anniversary dinner. Each dish was prepared and beautifully presented.",
      author: "Andy Smith",
      location: "San Francisco, CA",
    image: "../../../assets/img/p3.png"
    }
  ];
  faMugSaucer=faMugSaucer;
  faUtensils=faUtensils;
  faMugHot=faMugHot;
  faGlassWater =faGlassWater;
  faStroopwafel=faStroopwafel;
  faPhone=faPhone;
  faLocationDot=faLocationDot;
  faMessage=faMessage;
  faEnvelope=faEnvelope;
  faMapMarkedAlt=faMapMarkedAlt;
  faClock=faClock
  faCartShopping=faCartShopping
  faPercent=faPercent
  isLoggedin:boolean = false;



  constructor( private authService : AuthService ,  private router: Router ){
    if (this.authService.isLoggedIn()) {
      const role = this.authService.getUserRole();
      if (role === 'admin') {
        this.router.navigate(['/admin']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }


ngOnInit(): void {
  this.showItems();
}
@HostListener('window:scroll', ['$event'])
onScroll(): void {
  this.showItems();
}

showItems(): void {
  const serviceItems = document.querySelectorAll('.service-item');
  const triggerBottom = window.innerHeight * 0.85;
  serviceItems.forEach((item: any) => {
    const itemTop = item.getBoundingClientRect().top;
    if (itemTop < triggerBottom) {
      item.classList.add('show');
    } else {
      item.classList.remove('show');
    }
  });
}


}
