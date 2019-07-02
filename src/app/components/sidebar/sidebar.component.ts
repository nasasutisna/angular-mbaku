import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { AuthService } from 'app/service/auth.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { GlobalService } from 'app/global.service';

declare const $: any;
declare interface RouteInfo {
	path: string;
	title: string;
	icon: string;
	class: string;
}

export const ROUTES: RouteInfo[] = [
	{ path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
	{ path: '/login', title: 'Login', icon: 'account_circle', class: '' },
	// { path: '/table-list', title: 'Table List',  icon:'content_paste', class: '' },
	// { path: '/typography', title: 'Typography',  icon:'library_books', class: '' },
	// { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
	// { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
	{ path: '/register', title: 'Daftar Akun', icon: 'assignment_ind', class: '' },
	// { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
];

declare interface loginInfo<T> {
	msg: string;
	user: { userInfo: T, userStatus: any };
	isLogin: any;
}

declare interface anggota {
	alamat: string
	email: string
	jenis_kelamin: string
	kode_anggota: any;
	nama_lengkap: string;
	nomor_handphone: any;
	serial_id: any;
	status: any;
}
@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
	menuItems: any[];
	isMember: any;
	isAdmin: any;
	isLogin: any;
	keyword = new FormControl();
	userInfo: any;
	toggleButton:any;
	sidebarVisible:any;

	constructor(
		public authService: AuthService,
		public router: Router,
		public globalService:GlobalService
	) { }

	ngOnInit() {
		this.checkAuth();
		this.getAuth();
		// this.search();
		this.getUserInfo();
		this.menuItems = ROUTES.filter(menuItem => menuItem);
	}

	getUserInfo() {
		let auth = JSON.parse(localStorage.getItem('authentication'));
		let user = JSON.parse(localStorage.getItem('user'));
		if (auth) {
			this.isLogin = auth.isLogin.status;
			this.userInfo = user;
			if (auth.user.userStatus == 1) {
				this.isAdmin = true;
				this.isMember = false;
			} else {
				this.isAdmin = false;
				this.isMember = true;
			}
		}

		console.log(auth);
	}	

	checkChange(){
		this.authService.navbar.subscribe(() => {
			this.getUserInfo();
		});
	}


	checkAuth() {
		this.authService.auth.subscribe((data: loginInfo<anggota>) => {
			console.log(data);
			if (data.user.userStatus) {
				this.isAdmin = true;
			}
			else {
				this.isMember = true;
				ROUTES.push({ path: '/login', title: 'Keluar', icon: 'person', class: '' });
			}
		})
	}

	getAuth(){
		let auth = JSON.parse(localStorage.getItem('authentication'));
		console.log(auth);
		// if(auth){
		// 	ROUTES.push({ path: '/login', title: 'Member', icon: 'person', class: '' });

		// }
	}

	ngOnDestroy(): void {
		// this.authService.auth.unsubscribe();
	}

	isMobileMenu() {
		if ($(window).width() > 991) {
			return false;
		}
		return true;
	};

	gotoProfile(){
		this.router.navigateByUrl('/user-profile');
	}

	gotoHistory(){
		this.router.navigateByUrl('/history');
	}

	logout() {
		localStorage.removeItem('authentication');
		this.isLogin = false;
		this.router.navigateByUrl("/dashboard");
	}

	search() {
		this.globalService.newEvent(this.keyword.value);
	}

	sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
	};

}
