import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss']
})
export class Contact implements AfterViewInit, OnDestroy {
  sending = false;
  successMessage = '';
  errorMessage = '';

  // ViewChild để thao tác iframe theo chuẩn Angular
  @ViewChild('mapBox', { static: false }) mapBoxRef?: ElementRef<HTMLIFrameElement>;

  private io?: IntersectionObserver;

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

  ngAfterViewInit() {
    const iframeEl = this.mapBoxRef?.nativeElement;
    if (!iframeEl) return;

    // nếu trình duyệt hỗ trợ loading="lazy" ở iframe thì không cần fallback
    const supportsNativeLoading = 'loading' in HTMLIFrameElement.prototype;

    // nếu trình duyệt không hỗ trợ loading attr, sử dụng IntersectionObserver fallback
    if (!supportsNativeLoading) {
      const src = iframeEl.getAttribute('src');
      if (!src) return;

      // tạm thời remove src để tránh tải sớm
      iframeEl.removeAttribute('src');

      if ('IntersectionObserver' in window) {
        this.io = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // restore src để bắt đầu tải iframe
              iframeEl.src = src;
              // thêm class để trigger fade-in khi load xong
              iframeEl.classList.add('map-loading');
              // khi iframe load xong, bật effect fade
              iframeEl.onload = () => {
                iframeEl.classList.remove('map-loading');
                iframeEl.classList.add('map-loaded');
              };
              obs.disconnect();
            }
          });
        }, { rootMargin: '200px' }); // preload sớm một chút
        this.io.observe(iframeEl);
      } else {
        // No IntersectionObserver: fallback đơn giản — load after small delay
        setTimeout(() => {
          iframeEl.src = src;
          iframeEl.onload = () => {
            iframeEl.classList.add('map-loaded');
          };
        }, 500);
      }
    } else {
      // Nếu trình duyệt hỗ trợ native lazy loading, vẫn thêm class onload để fade-in khi hoàn thành
      iframeEl.onload = () => {
        iframeEl.classList.add('map-loaded');
      };
    }
  }

  ngOnDestroy(): void {
    if (this.io) {
      this.io.disconnect();
      this.io = undefined;
    }
  }
}
