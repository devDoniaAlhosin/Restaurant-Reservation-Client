import { Routes, RouterLinkActive } from '@angular/router';
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
import { PublicGuard } from './Core/guards/publicGuard/public.guard';
import { ContactComponent } from './Pages/contact/contact.component';
import { VerifyEmailComponent } from './Pages/auth/verify-email/verify-email.component';
import { ForgetPasswordComponent } from './Pages/auth/forget-password/forget-password.component';
import { ResetPasswordComponent } from './Pages/auth/reset-password/reset-password.component';

import { BookingComponent } from './Pages/booking/booking.component';
import { MybookingsComponent } from './Pages/mybookings/mybookings.component';

import { MenuComponent } from './Pages/menu/menu.component';
import { AboutComponent } from './Pages/about/about.component';

import { CalendarDashboardComponent } from './Pages/subs-dashboard/calendar-dashboard/calendar-dashboard.component';
import { ContactDashboardComponent } from './Pages/subs-dashboard/contact-dashboard/contact-dashboard.component';


export const routes: Routes = [
  { path: 'password-reset/:token', component: ResetPasswordComponent , title:"Bistro Bliss | reset Password"},
  { path: 'verify-email',
    component: VerifyEmailComponent ,
     canActivate: [PublicGuard],},
  {
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
      {
        path: 'calendar-dashboard',
        component: CalendarDashboardComponent,
        title: 'Bistro Bliss | Calender Dashboard',
      },
      {
        path: 'contact-dashboard',
        component: ContactDashboardComponent,
        title: 'Bistro Bliss | Contacts Dashboard',
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
        path: 'menu',
        component: MenuComponent,
        title: 'Bistro Bliss | Menu',
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
          // { path: 'reset-password', component: ResetPasswordComponent , title:"Bistro Bliss | reset Password" ,},
        ],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'Bistro Bliss | Profile',
        canActivate: [AuthGuard],
      },
      {path:"contact" , component: ContactComponent , title : "Bistro Bliss | Contact Us"},
      {path:'bookings' ,component:BookingComponent,
        title:'Bistro Bliss | Reservations',
        canActivate: [AuthGuard],
      },
      {path:'mybookings' ,component:MybookingsComponent,
        title:'Bistro Bliss | My Bookings',
        canActivate: [AuthGuard],

      },
      {
        path: 'about',
        component: AboutComponent,
        title: 'Bistro Bliss | About Us',
      },
      { path: '**', component: NotFoundComponent },


    ],
  },

];
