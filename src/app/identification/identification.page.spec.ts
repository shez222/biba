import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IdentificationPage } from './identification.page';

describe('IdentificationPage', () => {
  let component: IdentificationPage;
  let fixture: ComponentFixture<IdentificationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IdentificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
