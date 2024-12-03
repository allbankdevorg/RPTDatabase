import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ORPtransactionsComponent } from './orptransactions.component';

describe('ORPtransactionsComponent', () => {
  let component: ORPtransactionsComponent;
  let fixture: ComponentFixture<ORPtransactionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ORPtransactionsComponent]
    });
    fixture = TestBed.createComponent(ORPtransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
