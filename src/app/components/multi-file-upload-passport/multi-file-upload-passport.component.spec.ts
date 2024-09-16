import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MultiFileUploadPassportComponent } from './multi-file-upload-passport.component';

describe('MultiFileUploadPassportComponent', () => {
  let component: MultiFileUploadPassportComponent;
  let fixture: ComponentFixture<MultiFileUploadPassportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiFileUploadPassportComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MultiFileUploadPassportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
