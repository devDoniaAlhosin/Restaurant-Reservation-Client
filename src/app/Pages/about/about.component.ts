import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  isPaused: boolean = false;
  videoElement!: HTMLVideoElement;

  // Toggle play/pause
  toggleVideo() {
    if (this.videoElement.paused) {
      this.videoElement.play();
      this.isPaused = false;
    } else {
      this.videoElement.pause();
      this.isPaused = true;
    }
  }

  // Reference the video element after the view has initialized
  ngAfterViewInit() {
    this.videoElement = document.getElementById('myVideo') as HTMLVideoElement;
  }
}
