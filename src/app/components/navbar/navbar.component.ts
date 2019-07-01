import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { GlobalService } from 'app/global.service';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from 'app/service/auth.service';

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

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
	@ViewChild('searchInput') inputEl: ElementRef;
	keyword = new FormControl();
	isSearch: boolean = false;
	private listTitles: any[];
	location: Location;
	mobile_menu_visible: any = 0;
	private toggleButton: any;
	public positionTop: any = '-8px';
	private sidebarVisible: boolean;
	menuItems: any[];
	isLogin: any;
	isAdmin: any;
	isMember: any;
	userInfo: any;
	screen: any;

	constructor(
		location: Location,
		private element: ElementRef,
		private router: Router,
		public globalService: GlobalService,
		public authService: AuthService
	) {
		this.location = location;
		this.sidebarVisible = false;
		this.screen = screen.width;
	}

	ngOnInit() {
		this.getUserInfo();
		this.checkAuth();
		this.checkChange();
		this.search();
		console.log('on init');
		console.log(ROUTES.values);
		this.menuItems = ROUTES.filter(menuItem => menuItem);
		this.listTitles = ROUTES.filter(listTitle => listTitle);
		const navbar: HTMLElement = this.element.nativeElement;
		this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
		console.log('class',navbar.getElementsByClassName('navbar-toggler'))
		this.router.events.subscribe((event) => {
			this.sidebarClose();
			var $layer: any = document.getElementsByClassName('close-layer')[0];
			if ($layer) {
				$layer.remove();
				this.mobile_menu_visible = 0;
			}
		});
	}

	toggleSearch() {
		setTimeout(() => {
			this.inputEl.nativeElement.focus();
		}, 100)
		this.isSearch = !this.isSearch;
	}

	sidebarOpen() {
		const toggleButton = this.toggleButton;
		const body = document.getElementsByTagName('body')[0];
		setTimeout(function () {
			toggleButton.classList.add('toggled');
		}, 500);

		body.classList.add('nav-open');

		this.sidebarVisible = true;
		console.log(this.toggleButton);
	};

	sidebarClose() {
		const body = document.getElementsByTagName('body')[0];
		this.toggleButton.classList.remove('toggled');
		this.sidebarVisible = false;
		body.classList.remove('nav-open');
	};

	sidebarToggle() {
		// const toggleButton = this.toggleButton;
		// const body = document.getElementsByTagName('body')[0];
		var $toggle = document.getElementsByClassName('navbar-toggler')[0];

		if (this.sidebarVisible === false) {
			this.sidebarOpen();
		} else {
			this.sidebarClose();
		}
		const body = document.getElementsByTagName('body')[0];

		if (this.mobile_menu_visible == 1) {
			// $('html').removeClass('nav-open');
			body.classList.remove('nav-open');
			if ($layer) {
				$layer.remove();
			}
			setTimeout(function () {
				$toggle.classList.remove('toggled');
			}, 400);

			this.mobile_menu_visible = 0;
		} else {
			setTimeout(function () {
				$toggle.classList.add('toggled');
			}, 430);

			var $layer = document.createElement('div');
			$layer.setAttribute('class', 'close-layer');


			if (body.querySelectorAll('.main-panel')) {
				document.getElementsByClassName('main-panel')[0].appendChild($layer);
			} else if (body.classList.contains('off-canvas-sidebar')) {
				document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
			}

			setTimeout(function () {
				$layer.classList.add('visible');
			}, 100);

			$layer.onclick = function () { //asign a function
				body.classList.remove('nav-open');
				this.mobile_menu_visible = 0;
				$layer.classList.remove('visible');
				setTimeout(function () {
					$layer.remove();
					$toggle.classList.remove('toggled');
				}, 400);
			}.bind(this);

			body.classList.add('nav-open');
			this.mobile_menu_visible = 1;

		}
	};

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
			ROUTES.slice(ROUTES.findIndex(idx => idx.title == 'Daftar Akun'));
			ROUTES.slice(ROUTES.findIndex(idx => idx.title == 'Member Login'));
			this.isLogin = true;
			this.userInfo = data;
			if (data.user.userStatus) {
				this.isAdmin = true;
			}
			else {
				this.isMember = true;
			}
		})
	}

	logout() {
		localStorage.removeItem('authentication');
		this.isLogin = false;
		this.router.navigateByUrl("/dashboard");
	}

	getTitle() {
		var titlee = this.location.prepareExternalUrl(this.location.path());
		if (titlee.charAt(0) === '#') {
			titlee = titlee.slice(2);
		}
		titlee = titlee.split('/').pop();

		for (var item = 0; item < this.listTitles.length; item++) {
			if (this.listTitles[item].path === titlee) {
				return this.listTitles[item].title;
			}
		}
		return 'Dashboard';
	}

	clearKeyword() {
		this.keyword.setValue('');
	}

	search() {
		this.keyword.valueChanges.subscribe(() => {
			if (this.keyword.value) {
				this.positionTop = '-13px';
			} else {
				this.positionTop = '-8px';
			}
		})

		this.keyword.valueChanges.pipe(debounceTime(1500)).subscribe((value) => {

			// console.log('val',this.ke)
			this.globalService.newEvent(value);
		})
	}

	gotoProfile(){
		this.router.navigateByUrl('/user-profile');
	}

	gotoHistory(){
		this.router.navigateByUrl('/history');
	}
}
