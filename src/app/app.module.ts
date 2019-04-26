import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { DataListModule }  from 'primeng/primeng';
import { AgmCoreModule } from '@agm/core';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatRadioModule, MatSelectModule, MatSnackBarModule, MatToolbarModule } from '@angular/material';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AnggotaRegisterComponent } from './pages/anggota/anggota-register/anggota-register.component';
import { LoaderInterceptorService } from './service/loader-interceptor.service';
import { AuthService } from './service/auth.service';
@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    DataListModule,
    HttpClientModule,
    ComponentsModule,
    MatIconModule,
    RouterModule,
    FlexLayoutModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    })
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    RegisterComponent,
    AnggotaRegisterComponent
    // DashboardComponent,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: LoaderInterceptorService,
    multi: true
  },
  AuthService,
],
  bootstrap: [AppComponent]
})
export class AppModule { }
