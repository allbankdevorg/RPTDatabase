import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RPOfficerRIComponent } from './rpofficer-ri.component';

describe('RPOfficerRIComponent', () => {
  let component: RPOfficerRIComponent;
  let fixture: ComponentFixture<RPOfficerRIComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RPOfficerRIComponent]
    });
    fixture = TestBed.createComponent(RPOfficerRIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
