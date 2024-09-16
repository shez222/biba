import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import { RequestAddPage } from '../request-add/request-add.page';
import {TranslationService} from "../services/translation.service";

@Component({
  selector: 'app-open-requests-main',
  templateUrl: './open-requests-main.page.html',
  styleUrls: ['./open-requests-main.page.scss'],
})

export class OpenRequestsMainPage implements OnInit
{

  constructor(private SendReceiveRequestsService: SendReceiveRequestsService,
              private ModalController: ModalController,
              public translation: TranslationService)
  { }

  ngOnInit()
  {
  }

  async NewRequest()
  {
    const modal = await this.ModalController.create({
      component: RequestAddPage,
      showBackdrop: false,
    });
    return await modal.present();
  }
}
