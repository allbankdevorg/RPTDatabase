import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForreviewComponent } from './forreview.component';

describe('ForreviewComponent', () => {
  let component: ForreviewComponent;
  let fixture: ComponentFixture<ForreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForreviewComponent]
    });
    fixture = TestBed.createComponent(ForreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
