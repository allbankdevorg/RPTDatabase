import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankofficerRIModalComponent } from './bankofficer-rimodal.component';

describe('BankofficerRIModalComponent', () => {
  let component: BankofficerRIModalComponent;
  let fixture: ComponentFixture<BankofficerRIModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BankofficerRIModalComponent]
    });
    fixture = TestBed.createComponent(BankofficerRIModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
