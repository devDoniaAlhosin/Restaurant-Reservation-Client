import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScrollAnimation]',
  standalone: true
})
export class ScrollAnimationDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {

    this.renderer.addClass(this.el.nativeElement, 'hidden');
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const componentPosition = this.el.nativeElement.offsetTop;
    const scrollPosition = window.pageYOffset + window.innerHeight - 100; // Adjust trigger point

    if (scrollPosition >= componentPosition) {
      this.renderer.addClass(this.el.nativeElement, 'show');
    }
  }

}
