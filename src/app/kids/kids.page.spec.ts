import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { KidsPage } from './kids.page';

describe('KidsPage', () => {
  let component: KidsPage;
  let fixture: ComponentFixture<KidsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KidsPage],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(KidsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
