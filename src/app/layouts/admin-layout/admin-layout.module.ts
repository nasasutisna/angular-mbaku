import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from 'app/pages/dashboard/dashboard.component';
import { UserProfileComponent } from 'app/pages/user-profile/user-profile.component';
import { TableListComponent } from 'app/pages/table-list/table-list.component';
import { TypographyComponent } from 'app/pages/typography/typography.component';
import { IconsComponent } from 'app/icons/icons.component';
import { MapsComponent } from 'app/pages/maps/maps.component';
import { UpgradeComponent } from 'app/pages/upgrade/upgrade.component';
import { NgxContentLoadingModule } from 'ngx-content-loading';
import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
  MatCheckboxModule,
  MatNativeDateModule,
  MatBottomSheetModule,
  MatToolbarModule,
  MatExpansionModule,
  MatIconModule,
  MatCardModule,
  MatGridListModule,
  MatSnackBarModule,
  MatDialogModule,
  MatDividerModule,
  MatListModule,
  MatPaginatorModule,
} from '@angular/material';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { ToastModule } from 'primeng/toast';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BookDetailComponent } from 'app/pages/book/book-detail/book-detail.component';
import { BookEbookViewModule } from 'app/pages/book-ebook-view/book-ebook-view.module';
import { NotificationsComponent } from 'app/pages/notifications/notifications.component';
import { BookComponent } from 'app/pages/admin/book/book.component';

@NgModule({
  imports: [
    NgxContentLoadingModule,
    FlexLayoutModule,
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatDividerModule,
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
    MatDialogModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatIconModule,
    BookEbookViewModule,
    MatCarouselModule
  ],
  declarations: [
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    UpgradeComponent,
    BookComponent,
  ]
})

export class AdminLayoutModule {}
