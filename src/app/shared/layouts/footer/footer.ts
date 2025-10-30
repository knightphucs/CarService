import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {}
