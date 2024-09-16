import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestToApplyPage } from './request-to-apply.page';

describe('RequestToApplyPage', () => {
  let component: RequestToApplyPage;
  let fixture: ComponentFixture<RequestToApplyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RequestToApplyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
