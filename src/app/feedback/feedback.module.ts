import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeedbackPageRoutingModule } from './feedback-routing.module';
import { FeedbackPage } from './feedback.page';
import {SharedModule} from "../shared.module";

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        FeedbackPageRoutingModule,
        SharedModule
    ],
  declarations: [FeedbackPage]
})
export class FeedbackPageModule {}
