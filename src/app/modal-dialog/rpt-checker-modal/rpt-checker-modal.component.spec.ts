import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RptCheckerModalComponent } from './rpt-checker-modal.component';

describe('RptCheckerModalComponent', () => {
  let component: RptCheckerModalComponent;
  let fixture: ComponentFixture<RptCheckerModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RptCheckerModalComponent]
    });
    fixture = TestBed.createComponent(RptCheckerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
