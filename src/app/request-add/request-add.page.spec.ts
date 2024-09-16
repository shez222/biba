import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestAddPage } from './request-add.page';

describe('RequestAddPage', () => {
  let component: RequestAddPage;
  let fixture: ComponentFixture<RequestAddPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RequestAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
