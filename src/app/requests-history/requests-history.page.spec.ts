import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestsHistoryPage } from './requests-history.page';

describe('RequestsHistoryPage', () => {
  let component: RequestsHistoryPage;
  let fixture: ComponentFixture<RequestsHistoryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RequestsHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
