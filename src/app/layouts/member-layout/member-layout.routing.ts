import { Routes } from '@angular/router';

import { DashboardComponent } from 'app/pages/dashboard/dashboard.component';
import { BookDetailComponent } from 'app/pages/book/book-detail/book-detail.component';
import { UserProfileComponent } from 'app/pages/user-profile/user-profile.component';
import { BookEbookViewComponent } from 'app/pages/book-ebook-view/book-ebook-view.component';
import { HistoryComponent } from 'app/pages/history/history.component';

export const MemberLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }
    { path: 'dashboard',      
        component: DashboardComponent},
    { path: 'book/:id',       component: BookDetailComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'ebook/:id',      component: BookEbookViewComponent },
    { path: 'history',      component: HistoryComponent },

];
