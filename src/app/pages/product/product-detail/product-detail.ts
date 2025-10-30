import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss']
})
export class ProductDetailComponent {
  // product basic
  product = {
    id: 'camry-25q',
    name: 'Toyota Camry 2.5Q',
    brand: 'Toyota',
    year: 2024,
    color: 'Đen/Trắng/Bạc',
    price: 1250000000,
    description:
      'Toyota Camry 2.5Q — sedan hạng D sang trọng với nội thất cao cấp, nhiều tính năng an toàn và vận hành êm ái.',
    highlights: [
      'Hệ thống an toàn 8 túi khí',
      'Cruise control thích ứng',
      'Hỗ trợ giữ làn đường',
      'Màn hình giải trí 9 inch'
    ]
  };

  // carousel images (mặc định)
  images: string[] = [
    'https://binhduong.toyota.com.vn/upload/product_detail/original/e0f64fe3d8c29f214f9365c2129796a2-1jpg-library-1751011436.jpg',
    'https://binhduong.toyota.com.vn/upload/product_detail/original/d4008204d937f90c9e135dc36409e758jpg-library-1751011436.jpg',
    'https://binhduong.toyota.com.vn/upload/product_detail/original/ec5529d051448cc59fd632ebf2e0751ajpg-library-1751011436.jpg',
    'https://binhduong.toyota.com.vn/upload/product_detail/original/04d75efade944f04b76e43c112ca0cbepng-library-1751011436.png'
  ];

  currentIndex = 0;
  private touchStartX = 0;

  // dealership / contact
  dealership = {
    phone: '0909 123 456',
    address: '123 Đường Ô Tô, Quận X, TP. HN'
  };

  // specs
  specList = [
    { label: 'Động cơ', value: '2.5L I4' },
    { label: 'Công suất', value: '206 hp' },
    { label: 'Hộp số', value: 'Tự động 8 cấp' },
    { label: 'Tiêu thụ', value: '6.5 L/100km' },
    { label: 'Dài x Rộng x Cao', value: '4,885 x 1,840 x 1,445 mm' },
    { label: 'Trọng lượng', value: '1,540 kg' }
  ];

  // color selector
  selectedColor: 'white' | 'black' = 'white';
  colorImageMap: Record<string, string> = {
    white: 'https://binhduong.toyota.com.vn/upload/filters/original/371-0-1751008852.jpg',
    black: 'https://binhduong.toyota.com.vn/upload/filters/original/830-1-1751008852.jpg'
  };

  // --- Quote block state ---
  dealershipTitle = '';
  priceUpdatedAt = '10/2025';

  versions = [
    { value: 'v1', label: 'Corolla Altis 1.8G', price: 733000000 },
    { value: 'v2', label: 'Corolla Altis 2.0V', price: 800000000 }
  ];

  colors = [
    { value: 'white', label: 'Trắng ngọc trai' },
    { value: 'black', label: 'Đen' }
  ];

  provinces = [
    { value: 'binh-duong', label: 'Bình Dương', plateFee: 2000000 },
    { value: 'hn', label: 'Hà Nội', plateFee: 20000000 },
    { value: 'hcm', label: 'TP. HCM', plateFee: 20000000 }
  ];

  insurances = [
    { value: 'none', label: 'Không chọn', price: 0 },
    { value: '1yr', label: 'Bảo hiểm thân xe 1 năm', price: 0 }
  ];

  selectedVersion = this.versions[0].value;
  selectedColorForQuote = this.colors[0].value;
  selectedProvince = this.provinces[0].value;
  selectedInsurance = this.insurances[0].value;

  basePrice = this.versions[0].price;
  insurancePrice = 0;
  taxRate = 0.10;
  taxAmount = 0;
  plateFee = this.provinces[0].plateFee || 0;
  registrationFee = 90000;
  civilInsurance = 530700;
  roadMaintenance = 1560000;
  totalPrice = 0;

  selectedImageForQuote = this.images?.[0] || this.colorImageMap['white'];

  // ---------- Carousel methods ----------
  public prev(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  public next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  public goTo(index: number): void {
    if (index >= 0 && index < this.images.length) this.currentIndex = index;
  }

  @HostListener('window:keydown', ['$event'])
  public handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') this.prev();
    else if (event.key === 'ArrowRight') this.next();
  }

  public onTouchStart(ev: TouchEvent): void {
    this.touchStartX = ev.changedTouches?.[0]?.screenX ?? 0;
  }

  public onTouchEnd(ev: TouchEvent): void {
    const endX = ev.changedTouches?.[0]?.screenX ?? 0;
    const diff = endX - this.touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) this.prev();
      else this.next();
    }
  }

  // ---------- Actions ----------
  public onContact(): void {
    window.location.href = `tel:${this.dealership.phone.replace(/\s+/g, '')}`;
  }

  public onQuote(): void {
    alert('Mở form "Báo giá lăn bánh" (bạn có thể thay bằng modal hoặc router navigation).');
  }

  public openMap(): void {
    const q = encodeURIComponent(this.dealership.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank');
  }

  // ---------- Color selector ----------
  // setColor: chỉ cập nhật ảnh preview cho phần Báo giá, KHÔNG thay gallery
  setColor(color: 'white' | 'black'): void {
    if (this.selectedColor === color) return;
    this.selectedColor = color;

    const imgForColor = this.colorImageMap[color];
    if (imgForColor) {
      // chỉ cập nhật ảnh dùng trong quote preview
      this.selectedImageForQuote = imgForColor;
    }
  }

  // ---------- Quote calculator ----------
  calculateQuote(): void {
  // 1) Giá cơ bản (phiên bản)
  const v = this.versions.find(x => x.value === this.selectedVersion);
  this.basePrice = v ? v.price : 0;

  // 2) Bảo hiểm thân xe (nếu có)
  const ins = this.insurances.find(x => x.value === this.selectedInsurance);
  this.insurancePrice = ins ? (ins.price || 0) : 0;

  // 3) Phí cấp biển: ưu tiên selectedPlateOption
  if (this.selectedPlateOption) {
    if (this.selectedPlateOption.key === 'huyen') {
      // nếu chọn Huyện -> dùng giá của selectedDistrict nếu có, nếu không fallback theo province
      this.plateFee = this.selectedDistrict
        ? (this.selectedDistrict.plateValue || 0)
        : (this.provinces.find(p => p.value === this.selectedProvince)?.plateFee || 0);
    } else {
      // loại khác: lấy giá trực tiếp từ option, nếu null thì fallback province
      this.plateFee = (this.selectedPlateOption.value ?? this.provinces.find(p => p.value === this.selectedProvince)?.plateFee) || 0;
    }
  } else {
    // fallback: lấy theo province cấu hình
    this.plateFee = this.provinces.find(p => p.value === this.selectedProvince)?.plateFee || 0;
  }

  // 4) Phí bảo trì đường bộ: lấy từ selectedRoadOption nếu có
  this.roadMaintenance = this.selectedRoadOption ? (this.selectedRoadOption.value || 0) : (this.roadMaintenance || 0);

  // 5) Thuế trước bạ
  this.taxAmount = Math.round((this.basePrice || 0) * (this.taxRate || 0));

  // 6) Các phí cố định (nếu cần có thể cấu hình bên ngoài)
  this.registrationFee = 90000;
  this.civilInsurance = 530700;

  // 7) Tổng giá
  this.totalPrice = (this.basePrice || 0)
    + (this.insurancePrice || 0)
    + (this.taxAmount || 0)
    + (this.plateFee || 0)
    + (this.registrationFee || 0)
    + (this.civilInsurance || 0)
    + (this.roadMaintenance || 0);

  // 8) Cập nhật ảnh preview cho phần Báo giá (không can thiệp gallery)
  const chosen = this.selectedColorForQuote || this.selectedColor || 'white';
  if (this.colorImageMap && this.colorImageMap[chosen]) {
    this.selectedImageForQuote = this.colorImageMap[chosen];
  }

  // 9) Debug: in console để dễ kiểm tra giá từng khoản
  console.log('calculateQuote result:', {
    selectedVersion: this.selectedVersion,
    basePrice: this.basePrice,
    insurancePrice: this.insurancePrice,
    taxAmount: this.taxAmount,
    plateFee: this.plateFee,
    registrationFee: this.registrationFee,
    civilInsurance: this.civilInsurance,
    roadMaintenance: this.roadMaintenance,
    totalPrice: this.totalPrice,
    selectedPlateOption: this.selectedPlateOption,
    selectedDistrict: this.selectedDistrict,
    selectedRoadOption: this.selectedRoadOption
  });
}


  openFinance() {
    alert('Mở form tư vấn trả góp (tùy chỉnh).');
  }

  downloadQuote() {
    alert('Tải báo giá (tích hợp export PDF ở đây).');
  }

  // đặt ở gần các state khác (ví dụ dưới priceUpdatedAt)
  activeTab: 'quote' | 'process' | 'policy' = 'quote';

  setActiveTab(tab: 'quote' | 'process' | 'policy'): void {
    this.activeTab = tab;
    // nếu muốn focus vào đầu phần khi chuyển tab (tuỳ chọn)
    // setTimeout(() => document.querySelector('.full-width-quote .quote-title')?.scrollIntoView({behavior:'smooth'}), 50);
  }

  // --- Districts per province (mẫu) ---
  districtsByProvince: Record<string, { key: string; label: string; plateValue: number }[]> = {
    'binh-duong': [
      { key: 'bd_thu-dau-mot', label: 'Thủ Dầu Một', plateValue: 2000000 },
      { key: 'bd_thuan-an', label: 'Thuận An', plateValue: 2000000 },
      { key: 'bd_di-an', label: 'Dĩ An', plateValue: 2000000 }
    ],
    'hn': [
      { key: 'hn_quan1', label: 'Ba Đình', plateValue: 20000000 },
      { key: 'hn_quan2', label: 'Hoàn Kiếm', plateValue: 20000000 }
    ],
    'hcm': [
      { key: 'hcm_q1', label: 'Quận 1', plateValue: 20000000 },
      { key: 'hcm_q7', label: 'Quận 7', plateValue: 20000000 }
    ]
  };

  // danh sách districts hiện tại (theo province)
  districtOptions: { key:string; label:string; plateValue:number }[] = [];

  // selected district object
  selectedDistrict: { key: string; label: string; plateValue: number } | null = null;

  // plateOptions (giữ như trước nhưng plateOptions.huyen sẽ chuyển thành "Chọn Huyện" khi cần)
  plateOptions = [
    { key: 'huyen', label: 'Huyện', value: null }, // value null: sẽ dùng selectedDistrict.plateValue
    { key: 'thanhpho', label: 'Thành phố (khoảng)', value: 1000000 },
    { key: 'hn_hcm', label: 'Hà Nội / TP.HCM', value: 20000000 }
  ];

  // road options (giữ label)
  roadOptions = [
    { key: 'dang_ky_ca_nhan', label: 'Đăng ký cá nhân', value: 1560000 },
    { key: 'dang_ky_doanh_nghiep', label: 'Đăng ký doanh nghiệp (theo tháng)', value: 180000 },
    { key: 'multi_30th', label: 'Đóng 30 tháng (chiết khấu)', value: 1560000 }
  ];

  // selected defaults (object)
  selectedPlateOption = this.plateOptions[0];
  selectedRoadOption = this.roadOptions[0];

  // gọi khi đổi province => cập nhật danh sách huyện tương ứng
  onProvinceChange(provinceValue: string) {
    this.districtOptions = this.districtsByProvince[provinceValue] || [];
    // chọn mặc định first nếu có
    this.selectedDistrict = this.districtOptions.length ? this.districtOptions[0] : null;

    // nếu plate option là Huyện, cập nhật plateFee (nếu đã tính trước đó)
    if (this.selectedPlateOption?.key === 'huyen') {
      this.plateFee = this.selectedDistrict ? this.selectedDistrict.plateValue : 0;
      if (this.totalPrice > 0) this.calculateQuote();
    }
  }

  // khi chọn plate option (Huyện/Thành phố/...)
  onPlateChange(opt: { key:string; label:string; value:number } ) {
    this.selectedPlateOption = opt;
    if (opt.key === 'huyen') {
      // nếu chưa có district list, tạo theo selectedProvince
      this.districtOptions = this.districtsByProvince[this.selectedProvince] || [];
      this.selectedDistrict = this.districtOptions.length ? this.districtOptions[0] : null;
      this.plateFee = this.selectedDistrict ? this.selectedDistrict.plateValue : 0;
    } else {
      this.plateFee = opt?.value ?? 0;
      // clear selectedDistrict because not needed
      this.selectedDistrict = null;
    }
    if (this.totalPrice > 0) this.calculateQuote();
  }

  // khi đổi district
  onDistrictChange(d: { key:string; label:string; plateValue:number } | null) {
    this.selectedDistrict = d;
    this.plateFee = d ? d.plateValue : 0;
    if (this.totalPrice > 0) this.calculateQuote();
  }

  // khi đổi road option
  onRoadChange(opt: { key:string; label:string; value:number }) {
    this.selectedRoadOption = opt;
    this.roadMaintenance = opt?.value ?? 0;
    if (this.totalPrice > 0) this.calculateQuote();
  }
/* ===== Collection section (methods + state) ===== */
  collectionTitle = 'BỘ SƯU TẬP';
  collectionImages: string[] = [
    'https://binhduong.toyota.com.vn/upload/product_detail/original/e0f64fe3d8c29f214f9365c2129796a2-1jpg-library-1751011436.jpg',
    'https://binhduong.toyota.com.vn/upload/product_detail/original/d4008204d937f90c9e135dc36409e758jpg-library-1751011436.jpg',
    'https://binhduong.toyota.com.vn/upload/product_detail/original/ec5529d051448cc59fd632ebf2e0751ajpg-library-1751011436.jpg',
    'https://binhduong.toyota.com.vn/upload/product_detail/original/04d75efade944f04b76e43c112ca0cbepng-library-1751011436.png',
  ];
  collectionIndex = 0;
  isCollectionHover = false;

  // move to previous slide
  colPrev(): void {
    this.collectionIndex = (this.collectionIndex - 1 + this.collectionImages.length) % this.collectionImages.length;
  }

  // move to next slide
  colNext(): void {
    this.collectionIndex = (this.collectionIndex + 1) % this.collectionImages.length;
  }

  // go to thumbnail index
  colGo(i: number): void {
    if (i >= 0 && i < this.collectionImages.length) this.collectionIndex = i;
  }

  // hover handlers used by template
  onCollectionEnter(): void { this.isCollectionHover = true; }
  onCollectionLeave(): void { this.isCollectionHover = false; }

  // download catalogue (placeholder)
  downloadCatalogue(): void {
    // thay URL bằng file PDF thật nếu có:
    // window.open('/assets/catalogue.pdf', '_blank');
    alert('Xử lý tải catalogue — gắn link/logic tải file ở đây.');
  }
//Nội thất//
// Tabs
  tabs = [
    { key: 'exterior', label: 'NGOẠI THẤT' },
    { key: 'interior', label: 'NỘI THẤT' },
    { key: 'performance', label: 'VẬN HÀNH' },
    { key: 'safety', label: 'AN TOÀN' }
  ];
  activeDetailTab: string = 'exterior';

  setDetailTab(key: string) {
    this.activeDetailTab = key;
    // nếu muốn scroll tới section: uncomment line dưới
    // setTimeout(()=> document.querySelector('.detail-tabs')?.scrollIntoView({behavior:'smooth'}), 10);
  }

  /* Nội dung mẫu cho từng tab: chỉnh ảnh + text theo project của bạn */
  detailContent: Record<string, Array<{ title: string; image: string; desc: string }>> = {
    exterior: [
      {
        title: 'Đầu xe',
        image: 'https://binhduong.toyota.com.vn/upload/product_detail/original/e0f64fe3d8c29f214f9365c2129796a2-1jpg-library-1751011436.jpg',
        desc: 'Phần đầu xe tạo ấn tượng bởi diện mạo tươi mới, trẻ trung với thiết kế tổ ong và mạ crom.'
      },
      {
        title: 'Mâm xe',
        image: 'https://binhduong.toyota.com.vn/upload/product_detail/original/d4008204d937f90c9e135dc36409e758jpg-library-1751011436.jpg',
        desc: 'Mâm xe với thiết kế nan xoắn thể hiện tính thể thao và thanh lịch.'
      },
      {
        title: 'Cụm đèn trước',
        image: 'https://binhduong.toyota.com.vn/upload/product_detail/original/ec5529d051448cc59fd632ebf2e0751ajpg-library-1751011436.jpg',
        desc: 'Cụm đèn LED cung cấp khả năng chiếu sáng tốt và tiết kiệm năng lượng.'
      }
    ],
    interior: [
      {
        title: 'Khoang lái',
        image: 'https://binhduong.toyota.com.vn/upload/product_detail/original/04d75efade944f04b76e43c112ca0cbepng-library-1751011436.png',
        desc: 'Khoang lái sang trọng, bố trí tiện dụng, vật liệu cao cấp.'
      },
      {
        title: 'Ghế ngồi',
        image: 'https://binhduong.toyota.com.vn/upload/product_detail/original/e0f64fe3d8c29f214f9365c2129796a2-1jpg-library-1751011436.jpg',
        desc: 'Ghế bọc da, hỗ trợ chỉnh điện và nhớ vị trí.'
      },
      {
        title: 'Cốp & Tiện ích',
        image: 'https://binhduong.toyota.com.vn/upload/product_detail/original/d4008204d937f90c9e135dc36409e758jpg-library-1751011436.jpg',
        desc: 'Khoang hành lý rộng rãi, ngăn chứa thông minh.'
      }
    ],
    performance: [
      { title: 'Động cơ', image: 'https://binhduong.toyota.com.vn/upload/product_detail/original/ec5529d051448cc59fd632ebf2e0751ajpg-library-1751011436.jpg', desc: 'Động cơ mạnh mẽ, tiết kiệm nhiên liệu.' },
      { title: 'Hộp số', image: 'https://binhduong.toyota.com.vn/upload/product_detail/original/04d75efade944f04b76e43c112ca0cbepng-library-1751011436.png', desc: 'Hộp số tự động 8 cấp êm ái.' },
      { title: 'Hệ thống treo', image: 'https://binhduong.toyota.com.vn/upload/product_detail/original/e0f64fe3d8c29f214f9365c2129796a2-1jpg-library-1751011436.jpg', desc: 'Hệ treo lấy nét vào sự ổn định và thoải mái.' }
    ],
    safety: [
      { title: 'An toàn tổng quan', image: 'https://binhduong.toyota.com.vn/upload/product_detail/original/d4008204d937f90c9e135dc36409e758jpg-library-1751011436.jpg', desc: 'Hệ thống 8 túi khí, khung xe chịu lực cao.' },
      { title: 'Hỗ trợ lái', image: 'https://binhduong.toyota.com.vn/upload/product_detail/original/ec5529d051448cc59fd632ebf2e0751ajpg-library-1751011436.jpg', desc: 'Hệ thống hỗ trợ giữ làn, cảnh báo va chạm.' },
      { title: 'Phanh & Cảm biến', image: 'https://binhduong.toyota.com.vn/upload/product_detail/original/04d75efade944f04b76e43c112ca0cbepng-library-1751011436.png', desc: 'Phanh ABS, EBD, cảm biến trước sau.' }
    ]
  };

  /* ===============================
   SECTION: PHỤ KIỆN (CÓ SLIDE)
=============================== */
  @ViewChild('slider', { static: false }) sliderRef!: ElementRef<HTMLDivElement>;

  accessoryTabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'interior', label: 'Nội thất' },
    { key: 'exterior', label: 'Ngoại thất' },
    { key: 'utility', label: 'Tiện ích' },
    { key: 'care', label: 'Chăm sóc & bảo vệ' },
    { key: 'electronic', label: 'Điện tử' }
  ];

  activeAccessoryTab = 'all';

  accessories = [
    {
      title: 'Khay hành lý',
      price: 1202300,
      image: 'https://binhduong.toyota.com.vn/upload/product_accessories/original/khay-hanh-ly-1684810567.jpg',
      desc: 'Giá đã bao gồm VAT, chưa bao gồm phí lắp đặt',
      category: 'exterior'
    },
    {
      title: 'Camera 360 Safe View 3D Sony TM',
      price: 19800000,
      image: 'https://binhduong.toyota.com.vn/upload/product_accessories/original/camera-360-safe-view-3d-sony-tm-1650077063.jpg',
      desc: 'Giá đã bao gồm VAT, chưa bao gồm phí lắp đặt',
      category: 'electronic'
    },
    {
      title: 'Chụp ống xả',
      price: 276100,
      image: 'https://binhduong.toyota.com.vn/upload/product_accessories/original/chup-ong-xa-1648715660.jpg',
      desc: 'Giá đã bao gồm VAT, chưa bao gồm phí lắp đặt',
      category: 'exterior'
    },
    {
      title: 'Bộ hỗ trợ khẩn cấp',
      price: 3206500,
      image: 'https://binhduong.toyota.com.vn/upload/product_accessories/original/bo-ho-tro-khan-cap-1648714742.png',
      desc: 'Giá đã bao gồm VAT, chưa bao gồm phí lắp đặt',
      category: 'care'
    },
    {
      title: 'Hộp giữ nhiệt',
      price: 1290000,
      image: 'https://binhduong.toyota.com.vn/upload/product_accessories/original/hop-giu-nhiet-1648714612.png',
      desc: 'Giá đã bao gồm VAT, chưa bao gồm phí lắp đặt',
      category: 'utility'
    }
  ];

  setAccessoryTab(tab: string) {
    this.activeAccessoryTab = tab;
    setTimeout(() => {
      if (this.sliderRef) this.sliderRef.nativeElement.scrollTo({ left: 0, behavior: 'smooth' });
    }, 50);
  }

  get filteredAccessories() {
    if (this.activeAccessoryTab === 'all') return this.accessories;
    return this.accessories.filter(a => a.category === this.activeAccessoryTab);
  }

  slideLeft() {
    if (this.sliderRef) this.sliderRef.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  slideRight() {
    if (this.sliderRef) this.sliderRef.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }
}
