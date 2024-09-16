import { Injectable } from '@angular/core';
import { Calendar } from '@awesome-cordova-plugins/calendar/ngx';
import {LoadingDialogService} from "./loading-dialog.service";
import {SendReceiveRequestsService} from "../providers/send-receive-requests.service";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private calendar: Calendar,
              private loadingDialogService : LoadingDialogService,
              private sendReceiveRequestsService: SendReceiveRequestsService) {

  }

  async addToCalendar(requestId: number) {
    await this.loadingDialogService.showLoadingDialog();

    try {
      const response : any = await this.sendReceiveRequestsService.GetRequestByID({ request_id: requestId });

      if (response.result === 1) {
        const requestData = response.myRequests;
        const fromDate = new Date(requestData.from_date);
        const toDate = new Date(requestData.to_date);

        const description = requestData.description ? requestData.description + "\n" : "";
        const calOptions = this.calendar.getCalendarOptions();
        calOptions.url = `https://babysitter-app.com/my-applies/${requestId}`;

        await this.calendar.createEventInteractivelyWithOptions(
          `Sitting - ${requestData.title}`,
          requestData.address,
          description,
          fromDate,
          toDate,
          calOptions
        );
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      await this.loadingDialogService.dismissLoadingDialog();
    }
  }
}
