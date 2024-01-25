import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForapprovalComponent } from './forapproval.component';

describe('ForapprovalComponent', () => {
  let component: ForapprovalComponent;
  let fixture: ComponentFixture<ForapprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForapprovalComponent]
    });
    fixture = TestBed.createComponent(ForapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
