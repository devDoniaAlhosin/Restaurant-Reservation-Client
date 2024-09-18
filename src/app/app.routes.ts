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

export const routes: Routes = [
  {
    path: 'admin-login',
    component: AdminLoginComponent,
    title: 'Bistro Bliss | Admin-Login',
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'users-dashboard',
        component: UsersDashboardComponent,
        title: 'Bistro Bliss | Dashboard',
      },
      {
        path: 'menu-dashboard',
        component: MenuDashboardComponent,
        title: 'Bistro Bliss | Dashboard',
      },
      {
        path: 'requests-dashboard',
        component: RequestsDashboardComponent,
        title: 'Bistro Bliss | Dashboard',
      },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        title: 'Bistro Bliss | Where Food Meets Passion',
      },
      {
        path: 'login',
        component: LoginComponent,
        title: 'Bistro Bliss | Login',
      },
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'Bistro Bliss | Profile',
      },
      { path: '**', component: NotFoundComponent },
    ],
  },
];
