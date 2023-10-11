import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Officer2ndDegRelativesComponent } from './officer2nd-deg-relatives.component';

describe('Officer2ndDegRelativesComponent', () => {
  let component: Officer2ndDegRelativesComponent;
  let fixture: ComponentFixture<Officer2ndDegRelativesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Officer2ndDegRelativesComponent]
    });
    fixture = TestBed.createComponent(Officer2ndDegRelativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
