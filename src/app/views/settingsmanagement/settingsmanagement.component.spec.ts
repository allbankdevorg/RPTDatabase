import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsmanagementComponent } from './settingsmanagement.component';

describe('SettingsmanagementComponent', () => {
  let component: SettingsmanagementComponent;
  let fixture: ComponentFixture<SettingsmanagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsmanagementComponent]
    });
    fixture = TestBed.createComponent(SettingsmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
