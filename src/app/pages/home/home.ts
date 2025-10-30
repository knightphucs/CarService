import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from 'primeng/button';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  badge: string;
  category: string;
}

interface Category {
  icon: string;
  name: string;
  count: number;
}

interface HeroSlide {
  title: string;
  subtitle: string;
  image: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule, ButtonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  currentSlide = 0;
  slideInterval: any;

  heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&h=600&fit=crop',
      title: 'Phụ Kiện Ô Tô Chính Hãng',
      subtitle: 'Nâng cấp xế yêu của bạn với hàng ngàn sản phẩm chất lượng',
    },
    {
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&h=600&fit=crop',
      title: 'Ưu Đãi Khủng Tháng 10',
      subtitle: 'Giảm giá lên đến 40% cho tất cả sản phẩm',
    },
    {
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&h=600&fit=crop',
      title: 'Tư Vấn Miễn Phí 24/7',
      subtitle: 'Đội ngũ chuyên gia sẵn sàng hỗ trợ bạn mọi lúc',
    },
  ];

  stats = [
    { icon: 'verified', value: '100%', label: 'Hàng chính hãng', color: '#4caf50' },
    { icon: 'local_shipping', value: '24h', label: 'Giao hàng nhanh', color: '#2196f3' },
    { icon: 'support_agent', value: '24/7', label: 'Hỗ trợ khách hàng', color: '#ff9800' },
    { icon: 'workspace_premium', value: '12 tháng', label: 'Bảo hành', color: '#e53935' },
  ];

  categories = [
    {
      name: 'Nội thất xe',
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop',
      count: 450,
    },
    {
      name: 'Ngoại thất xe',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop',
      count: 380,
    },
    {
      name: 'Âm thanh xe',
      image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&h=300&fit=crop',
      count: 220,
    },
    {
      name: 'Camera hành trình',
      image: 'https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?w=400&h=300&fit=crop',
      count: 180,
    },
    {
      name: 'Đèn LED',
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop',
      count: 320,
    },
    {
      name: 'Cảm biến lùi',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop',
      count: 150,
    },
  ];

  products = [
    {
      name: 'Camera hành trình 4K',
      price: 2500000,
      image: 'https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?w=300&h=300&fit=crop',
      badge: 'Hot',
      badgeClass: 'badge-hot',
    },
    {
      name: 'Loa sub Pioneer',
      price: 4200000,
      image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=300&h=300&fit=crop',
      badge: 'Mới',
      badgeClass: 'badge-new',
    },
    {
      name: 'Đèn LED nội thất',
      price: 850000,
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=300&h=300&fit=crop',
      badge: 'Giảm 30%',
      badgeClass: 'badge-sale',
    },
    {
      name: 'Cảm biến áp suất lốp',
      price: 1200000,
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=300&fit=crop',
      badge: 'Bán chạy',
      badgeClass: 'badge-bestseller',
    },
    {
      name: 'Thảm lót sàn 5D cao cấp',
      price: 1800000,
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=300&h=300&fit=crop',
      badge: 'Hot',
      badgeClass: 'badge-hot',
    },
    {
      name: 'Màn hình Android 10 inch',
      price: 6500000,
      image: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=300&h=300&fit=crop',
      badge: 'Mới',
      badgeClass: 'badge-new',
    },
    {
      name: 'Bọc vô lăng da cao cấp',
      price: 450000,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&h=300&fit=crop',
      badge: 'Bán chạy',
      badgeClass: 'badge-bestseller',
    },
    {
      name: 'Cốp điện tự động',
      price: 3200000,
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=300&fit=crop',
      badge: 'Giảm 25%',
      badgeClass: 'badge-sale',
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
      image: 'https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?w=400&h=250&fit=crop',
      date: '25/10/2025',
      category: 'Kinh nghiệm',
    },
    {
      title: 'Hướng dẫn chọn loa xe hơi phù hợp',
      image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=250&fit=crop',
      date: '22/10/2025',
      category: 'Hướng dẫn',
    },
    {
      title: 'Xu hướng độ xe 2025: Tối giản và thông minh',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop',
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

  ngOnInit() {
    this.startSlideshow();
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  startSlideshow() {
    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
    }, 5000);
  }

  setSlide(index: number) {
    this.currentSlide = index;
  }

  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
