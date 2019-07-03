import { Component, ViewChild, ElementRef, OnInit, NgModule } from '@angular/core';
import * as Chartist from 'chartist';
import { RestApiService } from 'app/service/rest-api.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { MatBottomSheetRef, MatBottomSheet, MatInput, MatPaginator } from '@angular/material';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { debounceTime } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from 'app/global.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [MessageService]
})
export class DashboardComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('searchInput') inputEl: ElementRef;
  bukuList: any = [];
  categories = new FormControl();
  sortBy = new FormControl();
  keyword = new FormControl();
  isSearch: boolean = false;
  isLoading: boolean = false;
  categorySelected: any[] = [];
  labelCategorySelected: string;
  categoryList: any[];
  sortByList: any[];

  upDown: string = "";
  sortTitle: any;
  sortColor: string = '';

  formData: any = {
    pageIndex: 0,
    pageSize: 6,
    category: [],
    keyword: '',
    sortBy: '',
    filterEbook: 0,
  }

  public totalSize = 0;
  populerList: any = [];
  showPopuler: any;
  filterEbook: any;
  pageEvent: any;
  populerCheckBox = new FormControl();
  filterEbookCheckBox = new FormControl();
  isMobile: boolean;
  isDesktop: boolean;

  constructor(
    public restApi: RestApiService,
    private messageService: MessageService,
    public bottomSheet: MatBottomSheet,
    private snackBar: MatSnackBar,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public globalService: GlobalService
  ) {
    this.getDataBuku();
    this.getCategories();

    this.showPopuler = localStorage.getItem('showPopuler');
    this.filterEbook = localStorage.getItem('filterEbook');
    this.populerCheckBox.setValue(this.showPopuler);
    this.filterEbookCheckBox.setValue(this.filterEbook);
    this.filterEbookAction({checked:this.filterEbook})

    if (screen.width > 748) {
      this.isDesktop = true;
    }
    else {
      this.isMobile = true;
    }

    this.sortByList = [
      { title: 'Ratting', value: 'ratting' },
      { title: 'Stok', value: 'stok' }
    ]
  }

  showSuccess() {
    console.log('success');
    this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Order submitted' });
  }

  toggleSearch() {
    setTimeout(() => {
      this.inputEl.nativeElement.focus();
    }, 100)
    this.isSearch = !this.isSearch;
  }

  public handlePage(e: any) {
    this.formData.pageIndex = e.pageIndex;
    this.formData.pageSize = e.pageSize;
    this.getDataBuku();
  }

  getDataBuku() {
    this.isLoading = true;
    this.restApi.getDataBuku(this.formData).subscribe((results: any) => {
      this.bukuList = results.data;
      this.totalSize = results.totalPage;
      this.isLoading = false;
      this.restApi.getPopularBook().subscribe((data) => {
        this.populerList = data;
      })
    },
      err => {
        this.showMessage('Data gagal diload, Silahkan cek koneksi anda');
        // this.isLoading = false;
      })
  }

  gotoDetailBook(id: any) {
    this.router.navigate(["/book/", id]);
  }

  getCategories() {
    this.isLoading = true;
    this.restApi.getCategories().subscribe((results: any) => {
      this.categoryList = results;
      this.isLoading = false;
    },
      err => {
        this.showMessage('Data gagal diload, Silahkan cek koneksi anda');
        // this.isLoading = false;
      })
  }

  showSelectedCategory(event) {
    let value = event.source.value;
    let checked = event.checked;
    let idx = this.categorySelected.findIndex(i => i === value);

    if (checked) {
      if (idx == -1) {
        this.categorySelected.push(value);
      }
    }
    else {
      if (idx != -1) {
        this.categorySelected.splice(idx, 1);
      }
    }


    if (this.categorySelected.length > 0) {
      let category: string = this.categorySelected[0];
      let split = category.split('|');
      this.labelCategorySelected = split[1];
    }

    this.isLoading = true;
    this.formData.category = JSON.stringify(this.categorySelected);
    this.restApi.getDataBuku(this.formData).subscribe((results: any) => {
      this.bukuList = results.data;
      this.totalSize = results.totalPage;
      this.isLoading = false;
    },
      err => {
        console.log('error', err);
        this.showMessage('Data gagal diload, Silahkan cek koneksi anda');
        // this.isLoading = false;
      });
  }

  search() {
    this.globalService.events$.forEach((keyword) => {
      this.formData.category = JSON.stringify(this.categorySelected);
      this.formData.keyword = keyword;

      this.restApi.getDataBuku(this.formData).subscribe((results: any) => {
        this.bukuList = results.data;
        this.totalSize = results.totalPage;
        this.isLoading = false;
      },
        err => {
          console.log('error', err);
          this.showMessage('Data gagal diload, Silahkan cek koneksi anda');
          // this.isLoading = false;
        });
    });
  }

  showMessage(message: string, action: string = 'Close') {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  sortingProcess(e) {
    this.sortTitle = e.title;
    this.upDown = (this.upDown == 'asc') ? 'desc' : 'asc';
    this.sortColor = '#c14345';
    this.formData.sortBy = e.value + '|' + this.upDown;
    this.getDataBuku();
  }

  showListPopuler(e) {
    this.showPopuler = e.checked;
    if (e.checked) {
      localStorage.setItem('showPopuler', e.checked);
    } else {
      localStorage.removeItem('showPopuler');
    }
  }

  filterEbookAction(e) {
    if (e.checked) {
      localStorage.setItem('filterEbook', e.checked);
    } else {
      localStorage.removeItem('filterEbook');
    }

    this.formData.filterEbook = (e.checked) ? 1 : 0;
    this.restApi.getDataBuku(this.formData).subscribe((results: any) => {
      this.bukuList = results.data;
      this.totalSize = results.totalPage;
      this.isLoading = false;
    },
      err => {
        console.log('error', err);
        this.showMessage('Data gagal diload, Silahkan cek koneksi anda');
        // this.isLoading = false;
      });
  }

  ngOnInit() {
    this.search();

  }

}

