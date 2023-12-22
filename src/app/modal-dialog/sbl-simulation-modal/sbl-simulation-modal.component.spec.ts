import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SBLSimulationModalComponent } from './sbl-simulation-modal.component';

describe('SBLSimulationModalComponent', () => {
  let component: SBLSimulationModalComponent;
  let fixture: ComponentFixture<SBLSimulationModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SBLSimulationModalComponent]
    });
    fixture = TestBed.createComponent(SBLSimulationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
