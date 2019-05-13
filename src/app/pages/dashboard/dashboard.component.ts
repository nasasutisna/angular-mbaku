import { Component, ViewChild, ElementRef, OnInit, NgModule } from '@angular/core';
import * as Chartist from 'chartist';
import { RestApiService } from 'app/service/rest-api.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { MatBottomSheetRef, MatBottomSheet, MatInput, MatPaginator } from '@angular/material';
import { TableListComponent } from 'app/pages/table-list/table-list.component';
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
  
  upDown:string = "";
  sortTitle:any;
  sortColor:string = '';

  formData: any = {
    pageIndex: 0,
    pageSize: 6,
    category: [],
    keyword: '',
    sortBy:'',
  }

  public totalSize = 0;
  populerList:any = [];
  showPopuler:any;
  populerCheckBox = new FormControl();

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
    this.populerCheckBox.setValue(this.showPopuler);
    console.log(this.populerCheckBox)
    // this.sortByList = [
    //   { title: 'Terpopuler' }, { title: 'Paling Banyak Disukai' }, { title: 'Paling Sedikit Disukai' }, { title: 'Stok Terbanyak' }, { title: 'Stok Terkecil' }
    // ]

    this.sortByList = [
      { title: 'Jumlah Ratting', value:'ratting' },
      { title: 'Jumlah Stok', value:'stok' }
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
      console.log(results);
      this.isLoading = false;
    },
      err => {
        this.showMessage('Data gagal diload, Silahkan cek koneksi anda');
        // this.isLoading = false;
      })
  }

  showSelectedCategory(event) {
    console.log(event);

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
      console.log('searc',keyword);

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
    // this.keyword.valueChanges.pipe(debounceTime(1500)).subscribe((keyword: any) => {
    //   console.log('keyword', keyword);
      
      
    // })
  }

  showMessage(message: string, action: string = 'Close') {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  sortingProcess(e){
    this.sortTitle = e.title;
    this.upDown = (this.upDown == 'asc') ? 'desc' : 'asc';
    this.sortColor ='#c14345';
    this.formData.sortBy = e.value + '|' + this.upDown;
    this.getDataBuku();
  }

  showListPopuler(e){
    this.showPopuler = e.checked;
    if(e.checked){
      localStorage.setItem('showPopuler',e.checked);
    }else{
      localStorage.removeItem('showPopuler');
    }
  }

  startAnimationForLineChart(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function (data) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
  };
  startAnimationForBarChart(chart) {
    let seq2: any, delays2: any, durations2: any;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq2 = 0;
  };

  ngOnInit() {
    this.search();
    /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */
    const dataDailySalesChart: any = {
      labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      series: [
        [12, 17, 7, 17, 23, 18, 38]
      ]
    };

    const optionsDailySalesChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
    }

    var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

    this.startAnimationForLineChart(dailySalesChart);


    /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

    const dataCompletedTasksChart: any = {
      labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
      series: [
        [230, 750, 450, 300, 280, 240, 200, 190]
      ]
    };

    const optionsCompletedTasksChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 }
    }

    var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

    // start animation for the Completed Tasks Chart - Line Chart
    this.startAnimationForLineChart(completedTasksChart);



    /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

    var datawebsiteViewsChart = {
      labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      series: [
        [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

      ]
    };
    var optionswebsiteViewsChart = {
      axisX: {
        showGrid: false
      },
      low: 0,
      high: 1000,
      chartPadding: { top: 0, right: 5, bottom: 0, left: 0 }
    };
    var responsiveOptions: any[] = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ];
    var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

    //start animation for the Emails Subscription Chart
    this.startAnimationForBarChart(websiteViewsChart);
  }

  openBottomSheet(): void {
    this.bottomSheet.open(TableListComponent);
  }
  

}

