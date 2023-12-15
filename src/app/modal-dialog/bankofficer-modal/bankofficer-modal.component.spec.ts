import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankofficerModalComponent } from './bankofficer-modal.component';

describe('BankofficerModalComponent', () => {
  let component: BankofficerModalComponent;
  let fixture: ComponentFixture<BankofficerModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BankofficerModalComponent]
    });
    fixture = TestBed.createComponent(BankofficerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
