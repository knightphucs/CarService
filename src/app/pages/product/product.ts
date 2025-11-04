// product.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


interface Car {
  id: number;
  name: string;
  brand: string;
  price: number;
  engine: number;
  fuel: string;
  available: boolean;
  promo: boolean;
  img?: string;
  image?: string;
  srcset?: string;
  seats?: number;       // số chỗ ngồi
  type?: string;        // kiểu dáng
  transmission?: string;// hộp số
  origin?: string;      // xuất xứ
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product.html',
  styleUrls: ['./product.scss'],
})
export class Product implements OnInit {
  cars: Car[] = [];
  filteredCars: Car[] = [];

  uniqueBrands: string[] = [];
  uniqueFuels: string[] = [];

  // new uniques
  uniqueTypes: string[] = [];
  uniqueTransmissions: string[] = [];
  uniqueSeats: number[] = [];
  uniqueOrigins: string[] = [];

  q = '';
  searchTop = '';
  minPrice = 0;
  maxPrice = 5000;
  engineSelect = '';
  onlyAvailable = false;
  hasPromo = false;
  sort = 'relevance';

  selectedBrands = new Set<string>();
  selectedFuels = new Set<string>();

  // new selected sets
  selectedTypes = new Set<string>();
  selectedTransmissions = new Set<string>();
  selectedSeats = new Set<number>();
  selectedOrigins = new Set<string>();

  sidebarOpen = false;

  formatPrice(price: number): string {
    if (price >= 1_000_000_000) {
      return (price / 1_000_000_000).toFixed(2).replace(/\.00$/, '') + ' tỷ';
    } else {
      return (price / 1_000_000).toFixed(0) + ' triệu';
    }
  }

  ngOnInit(): void {
    // ---------- CẬP NHẬT ẢNH VÀ DỮ LIỆU TẠI ĐÂY ----------
    this.cars = [
      {
        id: 1,
        name: 'Vua X1',
        brand: 'Toyota',
        price: 850000000,
        engine: 1.5,
        fuel: 'Xăng',
        available: true,
        promo: false,
        image: 'assets/images/cars/corolla-altis-18HEV.jpg',
        seats: 5,
        type: 'Sedan',
        transmission: 'CVT (Vô cấp)',
        origin: 'Thái Lan'
      },
      {
        id: 2,
        name: 'Flash GT',
        brand: 'Honda',
        price: 650000000,
        engine: 1.0,
        fuel: 'Xăng',
        available: true,
        promo: true,
        image: 'assets/images/cars/honda-flash-gt.jpg',
        seats: 5,
        type: 'Hatchback',
        transmission: 'Số tự động',
        origin: 'Việt Nam'
      },
      {
        id: 3,
        name: 'Storm EV',
        brand: 'VinFast',
        price: 1200000000,
        engine: 0,
        fuel: 'Điện',
        available: false,
        promo: false,
        image: 'assets/images/cars/vinfast-storm-ev.jpg',
        seats: 5,
        type: 'Crossover',
        transmission: 'Một cấp (EV)',
        origin: 'Việt Nam'
      },
      {
        id: 4,
        name: 'Cruiser 300',
        brand: 'Ford',
        price: 13500000000,
        engine: 2.0,
        fuel: 'Xăng',
        available: true,
        promo: false,
        image: 'assets/images/cars/ford-cruiser-300.jpg',
        seats: 5,
        type: 'SUV',
        transmission: 'Số tự động',
        origin: 'Mỹ'
      },
      {
        id: 5,
        name: 'EcoDrive',
        brand: 'Hyundai',
        price: 540000000,
        engine: 1.2,
        fuel: 'Xăng',
        available: true,
        promo: true,
        image: 'assets/images/cars/hyundai-ecodrive.jpg',
        seats: 5,
        type: 'Sedan',
        transmission: 'Số tự động',
        origin: 'Hàn Quốc'
      },
      {
        id: 6,
        name: 'Dakar V6',
        brand: 'Toyota',
        price: 22000000000,
        engine: 3.5,
        fuel: 'Diesel',
        available: false,
        promo: true,
        image: 'assets/images/cars/toyota-dakar-v6.jpg',
        seats: 7,
        type: 'Pickup',
        transmission: 'Số tự động',
        origin: 'Thái Lan'
      },
      {
        id: 7,
        name: 'MiniLux',
        brand: 'BMW',
        price: 30000000000,
        engine: 2.0,
        fuel: 'Xăng',
        available: true,
        promo: false,
        image: 'assets/images/cars/bmw-minilux.jpg',
        seats: 5,
        type: 'Sedan',
        transmission: 'Số tự động',
        origin: 'Đức'
      },
      {
        id: 8,
        name: 'City E',
        brand: 'Kia',
        price: 480000000,
        engine: 1.0,
        fuel: 'Xăng',
        available: true,
        promo: false,
        image: 'assets/images/cars/kia-city-e.jpg',
        seats: 5,
        type: 'Hatchback',
        transmission: 'Số tự động',
        origin: 'Hàn Quốc'
      },
    ];

    // đảm bảo image luôn tồn tại (nếu một entry thiếu image, gán placeholder)
    this.cars = this.cars.map(c => ({
      ...c,
      image: c.image ?? c.img ?? 'assets/images/placeholder-car.png'
    }));

    // unique lists
    this.uniqueBrands = Array.from(new Set(this.cars.map(c => c.brand))).sort();
    this.uniqueFuels = Array.from(new Set(this.cars.map(c => c.fuel))).sort();
    this.uniqueTypes = Array.from(new Set(this.cars.map(c => c.type ?? 'Chưa rõ'))).sort();
    this.uniqueTransmissions = Array.from(new Set(this.cars.map(c => c.transmission ?? 'Chưa rõ'))).sort();
    this.uniqueSeats = Array.from(new Set(this.cars.map(c => c.seats ?? 0))).filter(n => n > 0).sort((a,b) => a-b);
    this.uniqueOrigins = Array.from(new Set(this.cars.map(c => c.origin ?? 'Chưa rõ'))).sort();

    this.filteredCars = [...this.cars];
  }

  slugify(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  onBrandChange(brand: string, checked: boolean) {
    checked ? this.selectedBrands.add(brand) : this.selectedBrands.delete(brand);
  }

  onFuelChange(fuel: string, checked: boolean) {
    checked ? this.selectedFuels.add(fuel) : this.selectedFuels.delete(fuel);
  }

  // new handlers
  onTypeChange(type: string, checked: boolean) {
    checked ? this.selectedTypes.add(type) : this.selectedTypes.delete(type);
  }
  onTransmissionChange(t: string, checked: boolean) {
    checked ? this.selectedTransmissions.add(t) : this.selectedTransmissions.delete(t);
  }
  onSeatChange(seat: number, checked: boolean) {
    checked ? this.selectedSeats.add(seat) : this.selectedSeats.delete(seat);
  }
  onOriginChange(origin: string, checked: boolean) {
    checked ? this.selectedOrigins.add(origin) : this.selectedOrigins.delete(origin);
  }

  applyFilters() {
    const q = (this.q || this.searchTop || '').trim().toLowerCase();
    const minP = Number(this.minPrice || 0);
    const maxP = Number(this.maxPrice || Number.MAX_SAFE_INTEGER);

    let res = this.cars.filter(c => {
      if (q && !(c.name + ' ' + c.brand).toLowerCase().includes(q)) return false;
      if (c.price < minP || c.price > maxP) return false;
      if (this.selectedBrands.size && !this.selectedBrands.has(c.brand)) return false;
      if (this.selectedFuels.size && !this.selectedFuels.has(c.fuel)) return false;

      // new filter checks
      if (this.selectedTypes.size && !this.selectedTypes.has(c.type ?? 'Chưa rõ')) return false;
      if (this.selectedTransmissions.size && !this.selectedTransmissions.has(c.transmission ?? 'Chưa rõ')) return false;
      if (this.selectedSeats.size && !this.selectedSeats.has(c.seats ?? 0)) return false;
      if (this.selectedOrigins.size && !this.selectedOrigins.has(c.origin ?? 'Chưa rõ')) return false;

      if (this.engineSelect) {
        const e = Number(this.engineSelect);
        if (this.engineSelect === '3.0') {
          if (!(c.engine > 2.0)) return false;
        } else {
          if (!(c.engine <= e)) return false;
        }
      }

      if (this.onlyAvailable && !c.available) return false;
      if (this.hasPromo && !c.promo) return false;
      return true;
    });

    if (this.sort === 'price-asc') res.sort((a, b) => a.price - b.price);
    if (this.sort === 'price-desc') res.sort((a, b) => b.price - a.price);
    if (this.sort === 'engine-desc') res.sort((a, b) => b.engine - a.engine);

    this.filteredCars = res;
    this.sidebarOpen = false;
  }

  clearFilters() {
    this.q = '';
    this.searchTop = '';
    this.minPrice = 0;
    this.maxPrice = 5000;
    this.selectedBrands.clear();
    this.selectedFuels.clear();
    this.engineSelect = '';
    this.onlyAvailable = false;
    this.hasPromo = false;
    this.sort = 'relevance';

    // clear new selects
    this.selectedTypes.clear();
    this.selectedTransmissions.clear();
    this.selectedSeats.clear();
    this.selectedOrigins.clear();

    this.filteredCars = [...this.cars];
  }

  showAll() { this.filteredCars = [...this.cars]; }

  openSidebar() { this.sidebarOpen = true; }
  closeSidebar() { this.sidebarOpen = false; }

  viewDetail(id: number) { console.log('Xem chi tiết xe:', id); }
  addWishlist(id: number) { console.log('Thêm vào wishlist:', id); }
  addCart(id: number) { console.log('Đặt cọc xe:', id); }

  // xử lý lỗi ảnh (fallback)
  onImgError(event: Event) {
    const img = event.target as HTMLImageElement | null;
    if (!img) return;
    img.onerror = null; // ngăn vòng lặp nếu placeholder cũng lỗi
    img.src = 'assets/images/placeholder-car.png';
  }
}
