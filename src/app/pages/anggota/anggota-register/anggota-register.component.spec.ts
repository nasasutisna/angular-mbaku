import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnggotaRegisterComponent } from './anggota-register.component';

describe('AnggotaRegisterComponent', () => {
  let component: AnggotaRegisterComponent;
  let fixture: ComponentFixture<AnggotaRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnggotaRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnggotaRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
