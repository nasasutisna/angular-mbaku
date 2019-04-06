import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { NgxContentLoadingModule } from 'ngx-content-loading';
import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
  MatCheckboxModule,
  MatNavList,
  MatNativeDateModule,
  MatBottomSheetModule,
  MatToolbarModule,
  MatExpansionModule,
  MatIconModule,
  MatCardModule,
  MatGridListModule,
  MatSnackBarModule,
} from '@angular/material';

import { ToastModule } from 'primeng/toast';
import { BookDetailComponent } from 'app/book/book-detail/book-detail.component';
@NgModule({
  imports: [
    NgxContentLoadingModule,
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatGridListModule,
    MatToolbarModule,
    MatExpansionModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    ToastModule,
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    BookDetailComponent,
  ]
})

export class AdminLayoutModule {}
