import { AuthService } from './../../../Core/auth/auth.service';
import { DatePipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {  faExclamationCircle,faUser,faEnvelope,faFilter , faTrash} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
interface Message {
  id:number;
  subject: string;
  name: string;
  email: string;
  message: string;
  updated_at: any;
}
@Component({
  selector: 'app-contact-dashboard',
  standalone: true,
  imports: [NgFor , NgIf, DatePipe , TitleCasePipe , FontAwesomeModule],
  templateUrl: './contact-dashboard.component.html',
  styleUrl: './contact-dashboard.component.css'
})
export class ContactDashboardComponent {
  faFilter=faFilter
  faTrash=faTrash
  messages: Message[] = [];
  faEnvelope = faEnvelope;
  faUser = faUser;
  faExclamationCircle=faExclamationCircle

  filteredMessages: Message[] = [];
  selectedSubject: string = '';

  constructor(private authService : AuthService) { }

  ngOnInit(): void {
    this.loadMessages();
  }
   loadMessages(): void {
    this.authService.getContactMessage().subscribe(
      (response: Message[]) => {
        console.log(response)
        this.messages = response;
        this.filteredMessages = this.messages;
      },
      (error) => {
        console.error('Error fetching messages', error);
      }
    );
  }
  filterMessages(event: any): void {
    const selectedSubject = event.target.value;

    if (selectedSubject) {
      this.filteredMessages = this.messages.filter(
        (message) => message.subject === selectedSubject
      );
    } else {
      this.filteredMessages = this.messages;
    }
  }
  deleteMessage(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.deleteContactMessage(id).subscribe(
          () => {
            this.messages = this.messages.filter(message => message.id !== id);
            this.filterMessages({ target: { value: '' } });
            Swal.fire({
              title: 'Deleted!',
              text: 'The message has been deleted.',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000
            });
          },
          (error) => {
            console.error('Error deleting message', error);
            Swal.fire({
              title: 'Error!',
              text: 'There was an issue deleting the message.',
              icon: 'error'
            });
          }
        );
      }
    });
  }

}
