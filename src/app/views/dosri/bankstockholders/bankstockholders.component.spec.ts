import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankstockholdersComponent } from './bankstockholders.component';

describe('BankstockholdersComponent', () => {
  let component: BankstockholdersComponent;
  let fixture: ComponentFixture<BankstockholdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BankstockholdersComponent]
    });
    fixture = TestBed.createComponent(BankstockholdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
