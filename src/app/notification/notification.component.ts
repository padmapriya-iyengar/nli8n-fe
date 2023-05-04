import { Component, Input, OnInit } from '@angular/core';
import { NOTIFICATION_DETAILS } from '../entities/notification-details';
import * as _ from "lodash";
import { UtilityService } from '../commons/utilities.service';

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  constructor() { }
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
      let req = {}
      if (action == 'DELETE') {
        req = {
          'Notifications-id':{
            ItemId: data.ItemId
          },
          'Notifications-update':{
            Status:'I'
          },
          old:{
            Notifications:{
              'Notifications-id':{
                ItemId: data.ItemId
              }
            }
          }
        }
      } else if(action == 'READ'){
        req = {
          'Notifications-id': {
            ItemId: data.ItemId
          },
          'Notifications-update': {
            MessageReadStatus: 'Read'
          },
          old: {
            Notifications: {
              'Notifications-id': {
                ItemId: data.ItemId
              }
            }
          }
        }
      }
    }
  }
  getNotificationsSuccessHandler(response: any, prms: any) {
    let resp = response.Notifications
    if(resp){
      if(prms.action === 'READ'){
        prms.curComp.notifications[prms.index].ShowRead = false
        prms.curComp.notifications[prms.index].StyleClass = 'notf-row'
      } else if (prms.action === 'DELETE') {
        prms.curComp.notifications[prms.index].ShowRead = false
        prms.curComp.notifications[prms.index].ShowDelete = false
        prms.curComp.notifications[prms.index].ShowNotf = false
      }
    }
  }
  openNotification(data: any) {
    
  }
}
