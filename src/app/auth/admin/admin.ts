import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
})
export class AdminComponent {
[x: string]: any;
  loginForm = this.fbFormGroupPlaceholder(); // placeholder để TS không complain nếu strict
  loading = false;
  serverError: string | null = null;
  showPassword = false;
  now = new Date();

  constructor(private fb: FormBuilder, private router: Router) {
    // Khởi tạo form ở đây (sau khi fb đã được inject)
    this.loginForm = this.fb.group({
      user: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false],
    });
  }

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  adminAvatarUrl: string | null = null; // dataURL or object URL
  private previousObjectUrl: string | null = null; // nếu dùng createObjectURL
  adminInitial = 'A';

  ngOnInit() {
    const stored = localStorage.getItem('adminAvatar');
    if (stored) this.adminAvatarUrl = stored;
  }

  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];

    // optional validation
    const maxSizeMB = 2;
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Kích thước file quá lớn. Tối đa ${maxSizeMB} MB.`);
      input.value = '';
      return;
    }

    // Nếu bạn dùng data URL:
    const reader = new FileReader();
    reader.onload = () => {
      // nếu trước đó đã lưu object URL thì revoke (nếu có)
      if (this.previousObjectUrl) {
        try { URL.revokeObjectURL(this.previousObjectUrl); } catch(e){/*ignore*/ }
        this.previousObjectUrl = null;
      }

      const dataUrl = reader.result as string;
      this.adminAvatarUrl = dataUrl;

      try {
        localStorage.setItem('adminAvatar', dataUrl);
      } catch (e) {
        console.warn('Không lưu avatar vào localStorage:', e);
      }

      // reset input value để lần chọn tiếp theo luôn trigger change event
      if (this.fileInput && this.fileInput.nativeElement) {
        this.fileInput.nativeElement.value = '';
      }
    };
    reader.readAsDataURL(file);
  }

    removeAvatar() {
    // revoke object URL nếu trước đó dùng
    if (this.previousObjectUrl) {
      try { URL.revokeObjectURL(this.previousObjectUrl); } catch(e){/*ignore*/ }
      this.previousObjectUrl = null;
    }

    this.adminAvatarUrl = null;
    localStorage.removeItem('adminAvatar');

    // reset file input so next select will trigger change
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

    // helper để tránh lỗi tạm thời khi TypeScript kiểm tra trước constructor
    // (không bắt buộc nếu bạn cấu hình khác, nhưng an toàn với strict settings)
    private fbFormGroupPlaceholder(): any {
      return { get: () => null, value: {} };
    }

    get user() { return this.loginForm.get('user')!; }
    get password() { return this.loginForm.get('password')!; }

    togglePassword() {
      this.showPassword = !this.showPassword;
    }

    onSubmit() {
      if (this.loginForm.invalid) {
        this.loginForm.markAllAsTouched();
        return;
      }

      this.loading = true;
      this.serverError = null;

      // mock async login (thay bằng AuthService thật khi bạn có)
      setTimeout(() => {
        const { user, password } = this.loginForm.value;
        // đổi logic kiểm tra theo user
        if (user === 'admin' && password === 'password') {
          // giả lập điều hướng sau khi login thành công
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.serverError = 'Tên đăng nhập hoặc mật khẩu không đúng.';
        }
        this.loading = false;
      }, 900);
    }
  }
  function removeAvatar() {
    throw new Error('Function not implemented.');
  }
