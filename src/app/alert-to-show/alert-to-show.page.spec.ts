import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertToShowPage } from './alert-to-show.page';

describe('AlertToShowPage', () => {
  let component: AlertToShowPage;
  let fixture: ComponentFixture<AlertToShowPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AlertToShowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
