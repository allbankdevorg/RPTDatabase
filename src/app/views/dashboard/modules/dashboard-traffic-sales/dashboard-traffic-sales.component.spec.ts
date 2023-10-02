import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTrafficSalesComponent } from './dashboard-traffic-sales.component';

describe('DashboardTrafficSalesComponent', () => {
  let component: DashboardTrafficSalesComponent;
  let fixture: ComponentFixture<DashboardTrafficSalesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardTrafficSalesComponent]
    });
    fixture = TestBed.createComponent(DashboardTrafficSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
