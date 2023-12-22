import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RPTSimulationModalComponent } from './rpt-simulation-modal.component';

describe('RPTSimulationModalComponent', () => {
  let component: RPTSimulationModalComponent;
  let fixture: ComponentFixture<RPTSimulationModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RPTSimulationModalComponent]
    });
    fixture = TestBed.createComponent(RPTSimulationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
