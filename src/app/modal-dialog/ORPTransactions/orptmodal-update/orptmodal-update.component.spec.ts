import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ORPTModalUpdateComponent } from './orptmodal-update.component';

describe('ORPTModalUpdateComponent', () => {
  let component: ORPTModalUpdateComponent;
  let fixture: ComponentFixture<ORPTModalUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ORPTModalUpdateComponent]
    });
    fixture = TestBed.createComponent(ORPTModalUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
