import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookEbookViewComponent } from './book-ebook-view.component';

describe('BookEbookViewComponent', () => {
  let component: BookEbookViewComponent;
  let fixture: ComponentFixture<BookEbookViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookEbookViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookEbookViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
