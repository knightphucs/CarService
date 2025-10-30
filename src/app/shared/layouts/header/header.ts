import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';

interface MenuItem {
  label: string;
  icon?: string;
  link?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatExpansionModule,
    FormsModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  openMenu: string | null = null;
  searchQuery = '';
  cartItemCount = 0;
  isMobileMenuOpen = false;

  // Static navigation pages
  navItems: MenuItem[] = [
    { label: 'Trang chủ', link: '/' },
    { label: 'Giới thiệu', link: '/gioi-thieu' },
    { label: 'Sản phẩm', link: '/cua-hang' },
    { label: 'Tin tức', link: '/tin-tuc' },
    { label: 'Video', link: '/video' },
    { label: 'Tuyển dụng', link: '/tuyen-dung' },
    { label: 'Liên hệ', link: '/lien-he' },
  ];

  // Product categories with dropdowns
  categories: MenuItem[] = [
    {
      label: 'Phụ kiện – đồ chơi xe hơi',
      icon: 'toys',
      children: [
        { label: 'Đồ chơi xe bán tải Ford Ranger', link: '#' },
        { label: 'Đồ chơi xe Mazda 3', link: '#' },
        { label: 'Phụ kiện đồ chơi Mazda CX5 2018', link: '#' },
        { label: 'Đồ chơi xe EcoSport', link: '#' },
        { label: 'Đồ chơi xe Honda CRV', link: '#' },
        { label: 'Đồ chơi xe Honda City', link: '#' },
        { label: 'Đồ chơi xe Honda Fortune 2017', link: '#' },
      ],
    },
    { label: 'Bọc ghế da ô tô', icon: 'event_seat', link: '#' },
    { label: 'Camera hành trình', icon: 'videocam', link: '#' },
    { label: 'Cách âm chống ồn', icon: 'volume_off', link: '#' },
    { label: 'Dán phim cách nhiệt', icon: 'wb_sunny', link: '#' },
    { label: 'Màn hình DVD', icon: 'tv', link: '#' },
    { label: 'Nắp thùng bán tải', icon: 'inventory_2', link: '#' },
    { label: 'Phụ kiện chính hãng', icon: 'verified', link: '#' },
  ];

  toggleMenu(menu: string) {
    this.openMenu = this.openMenu === menu ? null : menu;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.openMenu = null;
    }
  }

  onSearch(): void {
    console.log('Searching for:', this.searchQuery);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : 'auto';
  }
}
