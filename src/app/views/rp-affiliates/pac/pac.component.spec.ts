import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PACComponent } from './pac.component';

describe('PACComponent', () => {
  let component: PACComponent;
  let fixture: ComponentFixture<PACComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PACComponent]
    });
    fixture = TestBed.createComponent(PACComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
