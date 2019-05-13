import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { GlobalService } from 'app/global.service';
import { RestApiService } from 'app/service/rest-api.service';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { NotifService } from 'app/service/notif.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-document-reader',
  templateUrl: './document-reader.component.html',
  styleUrls: ['./document-reader.component.scss']
})
export class DocumentReaderComponent implements OnInit {

  isLoading:any = false;
  page:any = 1;
  // totalPage:any = 0;
  urlBlob:any;
  thumbsBlob:any;
  @Input() urlFile:any;
  @Input() bookId:any;
  @Input() fileName:any;
  @Output() totalPage: EventEmitter<any> = new EventEmitter<any>();
  constructor(public globalService:GlobalService, public restApi: RestApiService, public notifService: NotifService, public router: Router) { }

  ngOnInit() {
    console.log(this.fileName);
    this.isLoading = true;
    this.restApi.getFile(this.fileName).subscribe((result) => {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.urlBlob = e.target.result;
        this.thumbsBlob = e.target.result;
      };
       reader.readAsArrayBuffer(result);
    }, err =>{
      this.router.navigate(['/book/',this.bookId]);
      this.notifService.showMessage('Ebook tidak tersedia', 'warning', 'bottom', 'right');
    })
  }

  setPage(event){
   this.page = event;
  }

  onProgress(e){
    if(e.loaded == e.total){
      this.isLoading = false
    }
  }

  complete(pdf: PDFDocumentProxy){
    this.totalPage.emit(pdf.numPages);
    this.isLoading = false
  }

}
