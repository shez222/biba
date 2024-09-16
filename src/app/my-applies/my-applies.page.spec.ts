import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyAppliesPage } from './my-applies.page';

describe('AppliesPage', () => {
  let component: MyAppliesPage;
  let fixture: ComponentFixture<MyAppliesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MyAppliesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
