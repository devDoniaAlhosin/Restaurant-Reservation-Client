import { Routes } from '@angular/router';
import { MainLayoutComponent } from './Layouts/main-layout/main-layout.component';
import { HomeComponent } from './Pages/home/home.component';
import { LoginComponent } from './Pages/auth/login/login.component';
import { AdminLoginComponent } from './Pages/auth/admin-login/admin-login.component';
import { AdminLayoutComponent } from './Layouts/admin-layout/admin-layout.component';
import { ProfileComponent } from './Pages/auth/profile/profile.component';
import { NotFoundComponent } from './Pages/not-found/not-found.component';

import { UsersDashboardComponent } from './Pages/subs-dashboard/users-dashboard/users-dashboard.component';
import { MenuDashboardComponent } from './Pages/subs-dashboard/menu-dashboard/menu-dashboard.component';
import { RequestsDashboardComponent } from './Pages/subs-dashboard/requests-dashboard/requests-dashboard.component';
import { WelcomeDashboardComponent } from './Pages/subs-dashboard/welcome-dashboard/welcome-dashboard.component';
import { AuthLayoutComponent } from './Layouts/auth-layout/auth-layout.component';
import { RegisterComponent } from './Pages/auth/register/register.component';
import { AdminGuard } from './Core/guards/adminGuard/admin.guard';
import { AuthGuard } from './Core/guards/authGuard/auth.guard';
import { publicGuard } from './Core/guards/publicGuard/public.guard';
import { ContactComponent } from './Pages/contact/contact.component';
import { VerifyEmailComponent } from './Pages/auth/verify-email/verify-email.component';
import { ForgetPasswordComponent } from './Pages/auth/forget-password/forget-password.component';
import { ResetPasswordComponent } from './Pages/auth/reset-password/reset-password.component';


export const routes: Routes = [
  { path: 'verify-email/:userId/:token', component: VerifyEmailComponent },  {
    path: 'admin-login',
    component: AdminLoginComponent,
    title: 'Bistro Bliss | Admin-Login',

  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    data: { role: 'admin' },
    children: [
      {
        path: '',
        component: WelcomeDashboardComponent,
        title: 'Bistro Bliss | Admin  Dashboard',
      },
      {
        path: 'users-dashboard',
        component: UsersDashboardComponent,
        title: 'Bistro Bliss | Users Dashboard',
      },
      {
        path: 'menu-dashboard',
        component: MenuDashboardComponent,
        title: 'Bistro Bliss | Menu Dashboard',
      },
      {
        path: 'requests-dashboard',
        component: RequestsDashboardComponent,
        title: 'Bistro Bliss | Requests Dashboard',
      },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
        title: 'Bistro Bliss | Where Food Meets Passion',

      },
      {
        path: 'auth',
        component: AuthLayoutComponent,
        title: 'Bistro Bliss | Authentication',
        children: [
          {path : '' , component: LoginComponent   },
          { path: 'login', component: LoginComponent  },
          { path: 'register', component: RegisterComponent  },
          { path: 'forget-password', component: ForgetPasswordComponent , title:"Bistro Bliss | Forget Password"},
          { path: 'reset-password', component: ResetPasswordComponent , title:"Bistro Bliss | reset Password"},
        ],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'Bistro Bliss | Profile',
        canActivate: [AuthGuard],
      },
      {path:"contact" , component: ContactComponent , title : "Bistro Bliss | Contact Us"},

      { path: '**', component: NotFoundComponent },
    ],
  },
];
