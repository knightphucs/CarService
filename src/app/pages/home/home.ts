import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from 'primeng/button';

interface Product {
  id?: number;
  name: string;
  price: number;
  image: string;
  badge?: string;
  badgeClass?: string;
  category?: string;
}

interface Category {
  id: number;
  name: string;
  image: string;
  count?: number;
}

interface HeroSlide {
  title: string;
  subtitle: string;
  image: string;
}

@Component({
  selector: 'app-home',
  // Nếu bạn dùng standalone component, bổ sung `standalone: true` và imports,
  // còn không thì để imports ở module.
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule, ButtonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sliderContainer', { static: false }) sliderContainer!: ElementRef;

  // Slider
  currentSlide = 0;
  private slideInterval: any = null;
  private readonly slideDelay = 5000; // ms
  private isPaused = false;

  // Touch swipe helpers
  private touchStartX = 0;
  private readonly swipeThreshold = 50; // px

  // Demo data (bạn giữ nguyên nếu cần)
  heroSlides: HeroSlide[] = [
    {
      image:
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&h=600&fit=crop',
      title: 'Phụ Kiện Ô Tô Chính Hãng',
      subtitle: 'Nâng cấp xế yêu của bạn với hàng ngàn sản phẩm chất lượng',
    },
    {
      image:
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&h=600&fit=crop',
      title: 'Ưu Đãi Khủng Tháng 10',
      subtitle: 'Giảm giá lên đến 40% cho tất cả sản phẩm',
    },
    {
      image:
        'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&h=600&fit=crop',
      title: 'Tư Vấn Miễn Phí 24/7',
      subtitle: 'Đội ngũ chuyên gia sẵn sàng hỗ trợ bạn mọi lúc',
    },
  ];

  // ---- giữ nguyên các mảng dữ liệu khác như bạn đã có ----
  stats = [
    { icon: 'verified', value: '100%', label: 'Hàng chính hãng', color: '#4caf50' },
    { icon: 'local_shipping', value: '24h', label: 'Giao hàng nhanh', color: '#2196f3' },
    { icon: 'support_agent', value: '24/7', label: 'Hỗ trợ khách hàng', color: '#ff9800' },
    { icon: 'workspace_premium', value: '12 tháng', label: 'Bảo hành', color: '#e53935' },
  ];

  categories: Category[] = [
    { id: 1, name: 'KIA NEW CARNIVAL', image: 'https://kiagovap-auto.com/wp-content/uploads/2024/09/new-canival-all-new-1536x864.png' },
    { id: 2, name: 'KIA NEW SONET', image: 'https://kiagovap-auto.com/wp-content/uploads/2024/06/kia-sonet-moi-nhat.png' },
    { id: 3, name: 'KIA NEW SELTOS', image: 'https://kiagovap-auto.com/wp-content/uploads/2024/05/kia-new-seltos-moi-nhat.png' },
    { id: 4, name: 'KIA CARENS NEW GENERATION', image: 'https://kiagovap-auto.com/wp-content/uploads/2022/11/kia-carens-1536x768.png' },
    { id: 5, name: 'KIA SPORTAGE', image: 'assets/images/cars/kia-sportage.png' },
    { id: 6, name: 'KIA MORNING', image: 'assets/images/cars/kia-moring.png' },
    { id: 7, name: 'KIA SOLUTO', image: 'https://kiagovap-auto.com/wp-content/uploads/2021/03/kia-soluto-1536x787.png' },
    { id: 8, name: 'KIA K3', image: 'assets/images/cars/kia-k3.png' },
    { id: 9, name: 'KIA K5', image: 'assets/images/cars/kia-k5.png' },
    { id: 10, name: 'KIA NEW SORENTO', image: 'https://kiagovap-auto.com/wp-content/uploads/2025/09/new-sorento-xam.png' },
  ];

  products: Product[] = [
    {
      name: 'Camera hành trình 4K',
      price: 2500000,
      image:
        'https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?w=300&h=300&fit=crop',
      badge: 'Hot',
    },
    {
      name: 'Loa sub Pioneer',
      price: 4200000,
      image:
        'https://images.unsplash.com/photo-1545127398-14699f92334b?w=300&h=300&fit=crop',
      badge: 'Mới',
    },
    {
      name: 'Đèn LED nội thất',
      price: 850000,
      image:
        'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=300&h=300&fit=crop',
      badge: 'Giảm 30%',
    },
    {
      name: 'Cảm biến áp suất lốp',
      price: 1200000,
      image:
        'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=300&fit=crop',
      badge: 'Bán chạy',
    },
    {
      name: 'Thảm lót sàn 5D cao cấp',
      price: 1800000,
      image:
        'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=300&h=300&fit=crop',
      badge: 'Hot',
    },
    {
      name: 'Màn hình Android 10 inch',
      price: 6500000,
      image:
        'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=300&h=300&fit=crop',
      badge: 'Mới',
    },
    {
      name: 'Bọc vô lăng da cao cấp',
      price: 450000,
      image:
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&h=300&fit=crop',
      badge: 'Bán chạy',
    },
    {
      name: 'Cốp điện tự động',
      price: 3200000,
      image:
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=300&fit=crop',
      badge: 'Giảm 25%',
    },
  ];

  services = [
    { icon: 'verified_user', title: 'Lắp đặt tận nơi', desc: 'Đội ngũ kỹ thuật chuyên nghiệp' },
    { icon: 'workspace_premium', title: 'Bảo hành chính hãng', desc: 'Cam kết bảo hành đầy đủ' },
    { icon: 'local_shipping', title: 'Giao hàng nhanh', desc: 'Giao hàng toàn quốc trong 24h' },
    { icon: 'headset_mic', title: 'Hỗ trợ 24/7', desc: 'Tư vấn miễn phí mọi lúc' },
  ];

  news = [
    {
      title: 'Top 5 camera hành trình tốt nhất 2025',
      image:
        'https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?w=400&h=250&fit=crop',
      date: '25/10/2025',
      category: 'Kinh nghiệm',
    },
    {
      title: 'Hướng dẫn chọn loa xe hơi phù hợp',
      image:
        'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=250&fit=crop',
      date: '22/10/2025',
      category: 'Hướng dẫn',
    },
    {
      title: 'Xu hướng độ xe 2025: Tối giản và thông minh',
      image:
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop',
      date: '20/10/2025',
      category: 'Tin tức',
    },
  ];

  testimonials = [
    {
      name: 'Anh Minh',
      location: 'Hà Nội',
      rating: 5,
      comment:
        'Sản phẩm chất lượng, nhân viên tư vấn nhiệt tình. Lắp đặt nhanh chóng, chuyên nghiệp.',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    {
      name: 'Chị Hương',
      location: 'TP.HCM',
      rating: 5,
      comment: 'Mình rất hài lòng với camera hành trình mua ở đây. Giá cả hợp lý, chất lượng tốt.',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    {
      name: 'Anh Tuấn',
      location: 'Đà Nẵng',
      rating: 5,
      comment: 'Shop uy tín, giao hàng đúng hẹn. Sẽ ủng hộ lâu dài.',
      avatar: 'https://i.pravatar.cc/150?img=33',
    },
  ];

  constructor(private router: Router) {}

  /* ---------- lifecycle ---------- */
  ngOnInit() {
    this.startSlideshow();
  }

  ngAfterViewInit() {
    // nếu muốn nhận keyboard focus cho slider
    try {
      if (this.sliderContainer && this.sliderContainer.nativeElement) {
        this.sliderContainer.nativeElement.setAttribute('tabindex', '0');
      }
    } catch (e) {
      // ignore if not available
    }
  }

  ngOnDestroy() {
    this.clearSlideshowInterval();
  }

  /* ---------- slideshow control ---------- */
  private startSlideshow() {
    this.clearSlideshowInterval();
    this.slideInterval = setInterval(() => {
      if (!this.isPaused) {
        this.nextSlideInternal();
      }
    }, this.slideDelay);
  }

  private clearSlideshowInterval() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }

  pauseSlideshow() {
    this.isPaused = true;
  }

  resumeSlideshow() {
    this.isPaused = false;
  }

  // khi user thao tác bằng tay -> reset timer để không đổi ngay lập tức
  private resetAndRestart() {
    this.clearSlideshowInterval();
    this.startSlideshow();
  }

  setSlide(index: number) {
    this.currentSlide = index % this.heroSlides.length;
    this.resetAndRestart();
  }

  // internal next (dùng bởi timer)
  private nextSlideInternal() {
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
  }

  nextSlide() {
    this.nextSlideInternal();
    this.resetAndRestart();
  }

  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.heroSlides.length) % this.heroSlides.length;
    this.resetAndRestart();
  }

  /* ---------- touch handlers (swipe) ---------- */
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].clientX;
    this.isPaused = true; // pause while touching
  }

  onTouchEnd(event: TouchEvent) {
    const endX = event.changedTouches[0].clientX;
    const diff = this.touchStartX - endX;
    if (Math.abs(diff) > this.swipeThreshold) {
      if (diff > 0) {
        // swipe left -> next
        this.nextSlide();
      } else {
        // swipe right -> prev
        this.prevSlide();
      }
    }
    this.isPaused = false;
  }

  /* ---------- keyboard navigation (optional) ---------- */
  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.prevSlide();
    } else if (event.key === 'ArrowRight') {
      this.nextSlide();
    }
  }

  /* ---------- navigation helpers ---------- */
  // gọi khi click nút "Xem tất cả"
  goToProductList() {
    this.router.navigate(['/product']);
  }

  // nếu bạn muốn điều hướng programmatically khi click card
  goToCategory(category: Category) {
    const slug = this.slugify(category.name);
    this.router.navigate(['/product-detail', slug]);
  }

  // Tạo slug cho URL thân thiện
  slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  /* ---------- helper for star display (giữ nguyên) ---------- */
  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }

  // ----- cấu hình cảm giác 3D -----
  private tiltMax = 6;      // max rotate degrees
  private popZ = 42;        // max image translateZ (px)
  private baseZ = 30;       // default translateZ (px)
  private shadowLift = 14;  // shadow lift (px)

  // helper clamp
  private clamp01(n: number) { return Math.max(0, Math.min(1, n)); }

  // xử lý di chuột -> tilt nhẹ + pop + shadow + reflection
  onCardMouseMove(event: MouseEvent, index: number) {
    const el = event.currentTarget as HTMLElement;
    if (!el) return;
    const stage = el.querySelector('.car-stage') as HTMLElement;
    const fig = el.querySelector('.car-figure') as HTMLElement;
    const img = el.querySelector('.car-img') as HTMLElement;
    const ground = el.querySelector('.car-ground') as HTMLElement;
    const refl = el.querySelector('.car-reflection') as HTMLElement;

    const rect = stage.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width; // 0..1
    const py = (event.clientY - rect.top) / rect.height; // 0..1

    const nx = (px - 0.5) * 2; // -1..1
    const ny = (py - 0.5) * 2;

    const rotY = -nx * this.tiltMax;
    const rotX = ny * this.tiltMax * 0.6;

    const centerDist = Math.abs(nx);
    const z = this.baseZ + (1 - centerDist) * (this.popZ - this.baseZ);

    if (fig) fig.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`;
    if (img) img.style.transform = `translateZ(${z}px) translateY(${-(ny * 6)}px)`;
    if (ground) {
      const lift = Math.max(0, (1 - Math.abs(ny)) * this.shadowLift);
      ground.style.transform = `translateY(${lift}px) scale(${1 + Math.abs(nx) * 0.06})`;
      ground.style.opacity = `${0.9 - Math.abs(nx) * 0.35}`;
    }
    if (refl) {
      refl.style.transform = `translateX(${nx * 8}px) scaleY(-1)`;
      refl.style.opacity = `${0.18 - Math.abs(nx) * 0.06}`;
    }
  }

  // reset khi rời chuột / chạm xong
  onCardMouseLeave(index: number) {
    const all = document.querySelectorAll('.car-card');
    const el = all[index] as HTMLElement | undefined;
    if (!el) return;
    const fig = el.querySelector('.car-figure') as HTMLElement;
    const img = el.querySelector('.car-img') as HTMLElement;
    const ground = el.querySelector('.car-ground') as HTMLElement;
    const refl = el.querySelector('.car-reflection') as HTMLElement;

    if (fig) { fig.style.transform = `rotateX(0deg) rotateY(0deg) translateZ(0)`; fig.style.transition = 'transform 420ms cubic-bezier(.2,.9,.25,1)'; }
    if (img) { img.style.transform = `translateZ(${this.baseZ}px) translateY(0px)`; img.style.transition = 'transform 420ms cubic-bezier(.2,.9,.25,1)'; }
    if (ground) { ground.style.transform = `translateY(0px) scale(1)`; ground.style.opacity = '0.9'; ground.style.transition = 'transform 420ms, opacity 420ms'; }
    if (refl) { refl.style.transform = `translateX(0px) scaleY(-1)`; refl.style.opacity = '0.18'; refl.style.transition = 'transform 420ms, opacity 420ms'; }
  }

  // touch handlers (map touch to mouse-like)
  onCardTouchStart(ev: TouchEvent, index: number) {
    const t = ev.touches[0];
    const fake = { clientX: t.clientX, clientY: t.clientY, currentTarget: ev.currentTarget } as unknown as MouseEvent;
    this.onCardMouseMove(fake, index);
  }
  onCardTouchMove(ev: TouchEvent, index: number) {
    const t = ev.touches[0];
    const fake = { clientX: t.clientX, clientY: t.clientY, currentTarget: ev.currentTarget } as unknown as MouseEvent;
    this.onCardMouseMove(fake, index);
  }
}
