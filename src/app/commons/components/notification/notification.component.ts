import { Component, Input, OnInit } from '@angular/core';
import { NOTIFICATION_DETAILS } from '../../../entities/notification-details';
import * as _ from "lodash";
import { UtilitiesService } from '../../services/utilities.service';
import { AgcService } from '../../services/agc.service';

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  constructor(private utilService: UtilitiesService, private agcService: AgcService) { }
  @Input() allNotifications: NOTIFICATION_DETAILS[] = [];
  notifications: NOTIFICATION_DETAILS[] = [];
  ngOnInit(): void {
    this.getAllNotifications();
  }
  getAllNotifications(){
    this.notifications = _.cloneDeep(this.allNotifications);
  }
  actOnNotf(action: string, data: any){
    let index = _.findIndex(this.notifications, function (notf) { return notf.ItemId == data.ItemId; })
    if(index != -1){
      this.agcService.updateUserNotifications(this.notifications[index].ItemId,action).subscribe({next: (response) => {
        if(action === 'READ'){
          this.notifications[index].ShowRead = false
          this.notifications[index].StyleClass = 'notf-row'
          this.utilService.alert('success', 'Success', 'Notification read successfully!!', false);
        } else if (action === 'DELETE') {
          this.notifications[index].ShowRead = false
          this.notifications[index].ShowDelete = false
          this.notifications[index].ShowNotf = false
          this.utilService.alert('success', 'Success', 'Notification deleted successfully!!', false);
        }
      },
      error: (error) => {
        console.error('Request failed with error')
      }
    })
    }
  }
  openNotification(data: any) {
    this.utilService.alert('error', 'Error', 'The request cannot be viewed!!', false);
  }
}