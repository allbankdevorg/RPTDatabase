import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherRPModalComponent } from './other-rpmodal.component';

describe('OtherRPModalComponent', () => {
  let component: OtherRPModalComponent;
  let fixture: ComponentFixture<OtherRPModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OtherRPModalComponent]
    });
    fixture = TestBed.createComponent(OtherRPModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
