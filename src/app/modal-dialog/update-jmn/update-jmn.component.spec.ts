import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateJMNComponent } from './update-jmn.component';

describe('UpdateJMNComponent', () => {
  let component: UpdateJMNComponent;
  let fixture: ComponentFixture<UpdateJMNComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateJMNComponent]
    });
    fixture = TestBed.createComponent(UpdateJMNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
