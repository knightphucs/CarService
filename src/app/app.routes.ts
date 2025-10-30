import { Routes } from '@angular/router';
import { Contact } from './pages/contact/contact';
import { Product } from './pages/product/product';
import { ProductDetailComponent } from './pages/product/product-detail/product-detail';
import { Home } from './pages/home/home';
import { Login } from './auth/login/login';

export const routes: Routes = [
    {path:'contact', component: Contact},
    {path:'product', component: Product},
    { path: 'product/:id', component: ProductDetailComponent},
    { path: '', component: Home },
    { path: 'login', component: Login }
];
