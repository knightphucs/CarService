import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-contact',
  standalone: true,          // <-- làm component standalone
  imports: [CommonModule, FormsModule], // <-- cung cấp ngIf, ngModel, ngForm
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss']
})

export class Contact {
  sending = false;
  successMessage = '';
  errorMessage = '';

  onSubmit(f: NgForm) {
    if (f.invalid) return;
    this.sending = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Demo: mô phỏng gửi form (thay bằng API call thật)
    setTimeout(() => {
      this.sending = false;
      this.successMessage = 'Cảm ơn! Tin nhắn của bạn đã được gửi.';
      f.resetForm();
    }, 900);
  }
}
