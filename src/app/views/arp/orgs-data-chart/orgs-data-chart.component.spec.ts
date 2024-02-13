import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgsDataChartComponent } from './orgs-data-chart.component';

describe('OrgsDataChartComponent', () => {
  let component: OrgsDataChartComponent;
  let fixture: ComponentFixture<OrgsDataChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrgsDataChartComponent]
    });
    fixture = TestBed.createComponent(OrgsDataChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
