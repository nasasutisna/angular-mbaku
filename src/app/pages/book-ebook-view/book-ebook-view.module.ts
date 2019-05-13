import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { BookDetailComponent } from 'app/pages/book/book-detail/book-detail.component';
import { BookEbookViewComponent } from 'app/pages/book-ebook-view/book-ebook-view.component';
import { DocumentReaderComponent } from 'app/components/document-reader/document-reader.component';
import { ComponentsModule } from 'app/components/components.module';
import { MatDividerModule, MatButtonModule, MatIconModule } from '@angular/material';

@NgModule({
  imports: [
    FlexLayoutModule,
    CommonModule,
    FormsModule,
    MatDividerModule,
    MatButtonModule,
    ComponentsModule,
    MatIconModule,
  ],
  declarations: [BookEbookViewComponent],
  exports: [BookEbookViewComponent]
})

export class BookEbookViewModule {}
