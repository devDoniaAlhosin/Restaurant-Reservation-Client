import { NgClass, NgIf } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {  faArrowUp} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-scroll-up-btn',
  standalone: true,
  imports: [ NgClass, NgIf  , FontAwesomeModule],
  templateUrl: './scroll-up-btn.component.html',
  styleUrl: './scroll-up-btn.component.css'
})
export class ScrollUpBtnComponent {
  faArrowUp=faArrowUp
  isVisible = false;
  ngOnInit(): void {}


  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const yOffset = window.pageYOffset || document.documentElement.scrollTop;
    this.isVisible = yOffset > 200;
  }


  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
