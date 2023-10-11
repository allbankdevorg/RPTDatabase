import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DIR2ndDegRelativesComponent } from './dir2nd-deg-relatives.component';

describe('DIR2ndDegRelativesComponent', () => {
  let component: DIR2ndDegRelativesComponent;
  let fixture: ComponentFixture<DIR2ndDegRelativesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DIR2ndDegRelativesComponent]
    });
    fixture = TestBed.createComponent(DIR2ndDegRelativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
