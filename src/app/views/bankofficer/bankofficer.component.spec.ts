import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankofficerComponent } from './bankofficer.component';

describe('BankofficerComponent', () => {
  let component: BankofficerComponent;
  let fixture: ComponentFixture<BankofficerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BankofficerComponent]
    });
    fixture = TestBed.createComponent(BankofficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
