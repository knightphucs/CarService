// product-detail.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Swatch {
  id: string;
  colorCss?: string;
  img: string;
  label?: string;
}
interface Product {
  id: string;
  brand?: string;
  title?: string;
  price?: number;
  currency?: string;
  specs?: string[];
  mainImg?: string;
  swatches?: Swatch[];
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss']
})
export class ProductDetailComponent implements OnInit {
  product?: Product;
  mainImg = '';
  swatches: Swatch[] = [];
  activeIndex = 0;

  // tab state
  activeTab: 'intro' | 'gallery' = 'intro';

  // demo dataset
  private PRODUCTS: Product[] = [
    {
      id: '1',
      brand: 'KIA CARNIVAL',
      title: 'Chuyến mình kiêu hãnh',
      price: 1299000000,
      currency: 'VND',
      specs: [
        'Số chỗ ngồi : 7/8 chỗ',
        'Kiểu dáng : Minivan',
        'Nhiên liệu : Xăng/Dầu',
        'Xuất xứ : Xe trong nước',
        'Số tự động',
        'Động cơ 2.2L Dầu / 1.6L Turbo Xăng Hybrid'
      ],
      mainImg: 'https://kiagovap-auto.com/wp-content/uploads/2024/09/KIA-NEW-CARNIVAL-TRANG-XANH-XAM.png',
      swatches: [
        { id: 'blue',  colorCss: '#7393a3', img: 'https://kiagovap-auto.com/wp-content/uploads/2024/09/KIA-NEW-CARNIVAL-TRANG-XANH-XAM.png',  label: 'Xanh' },
        { id: 'white', colorCss: '#ffffff', img: 'https://kiagovap-auto.com/wp-content/uploads/2024/09/KIA-NEW-CARNIVAL-TRANG.png', label: 'Trắng' },
        { id: 'brown', colorCss: '#612a19', img: 'https://kiagovap-auto.com/wp-content/uploads/2024/09/KIA-NEW-CARNIVAL-TRANG-DO.png', label: 'Nâu' }
      ]
    },
    {
      id: '2',
      brand: 'KIA RIO',
      title: 'Hành trình tiết kiệm',
      price: 499000000,
      currency: 'VND',
      specs: [
        'Số chỗ ngồi : 5 chỗ',
        'Kiểu dáng : Hatchback',
        'Nhiên liệu : Xăng',
        'Xuất xứ : Nhập khẩu'
      ],
      mainImg: 'https://example.com/rio-main.jpg',
      swatches: [
        { id: 'silver', colorCss: '#d6d6d6', img: 'https://example.com/rio-silver.jpg', label: 'Bạc' },
        { id: 'blue',   colorCss: '#1f6f8b', img: 'https://example.com/rio-blue.jpg',   label: 'Xanh' }
      ]
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // subscribe to param changes so navigating /product/1 -> /product/2 updates in-place
    this.route.paramMap.subscribe(mp => {
      const id = mp.get('id') || '';
      this.loadProductById(id);
    });
  }

  private loadProductById(id: string): void {
    const p = this.PRODUCTS.find(x => x.id === id);
    if (!p) {
      this.product = undefined;
      this.swatches = [];
      this.mainImg = '';
      this.activeIndex = 0;
      this.activeTab = 'intro';
      return;
    }

    this.product = p;
    this.swatches = p.swatches || [];
    this.activeIndex = 0;
    this.activeTab = 'intro';

    if (this.swatches.length) {
      this.preloadAndSetMain(this.swatches[0].img, 0);
    } else {
      this.preloadAndSetMain(p.mainImg || '', 0);
    }
  }

  // ---------- Image/color handling ----------
  selectColor(index: number): void {
    if (index < 0 || index >= this.swatches.length) return;
    if (index === this.activeIndex) return;
    const target = this.swatches[index];
    this.preloadAndSetMain(target.img, index);
  }

  private preloadAndSetMain(url: string, indexToSet: number): void {
    const pre = new Image();
    const imgEl = document.querySelector('.main-img') as HTMLImageElement | null;
    if (imgEl) imgEl.style.opacity = '0.6';

    pre.onload = () => {
      this.mainImg = url;
      this.activeIndex = indexToSet;
      if (imgEl) imgEl.style.opacity = '1';
    };
    pre.onerror = () => {
      this.activeIndex = indexToSet;
      if (!this.mainImg) this.mainImg = url;
      if (imgEl) imgEl.style.opacity = '1';
    };
    pre.src = url;
  }

  onSwatchKeydown(event: KeyboardEvent, index: number): void {
    const key = event.key;
    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      this.selectColor(index);
    } else if (key === 'ArrowRight') {
      this.selectColor(Math.min(this.swatches.length - 1, this.activeIndex + 1));
    } else if (key === 'ArrowLeft') {
      this.selectColor(Math.max(0, this.activeIndex - 1));
    }
  }

  // ---------- Tab handling ----------
  selectTab(tab: 'intro' | 'gallery'): void {
    this.activeTab = tab;
  }

  isActive(tab: 'intro' | 'gallery'): boolean {
    return this.activeTab === tab;
  }

  // ---------- Helpers ----------
  formatPrice(v?: number): string {
    if (v === undefined || v === null) return '';
    return new Intl.NumberFormat('vi-VN').format(v);
  }

  /**
   * Quay lại danh sách sản phẩm.
   * Thay '/product' bằng route danh sách thật của bạn nếu khác.
   */
  goBack(): void {
    this.router.navigate(['/product']);
    // nếu bạn muốn đơn giản là quay lại history browser (back):
    // import { Location } from '@angular/common' và dùng:
    // this.location.back();
  }
}
