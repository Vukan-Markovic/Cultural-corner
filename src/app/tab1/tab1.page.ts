import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Activity } from '../types';
import { ActivityService } from '../activity.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  activityList: Observable<Activity[]>;

  constructor(public activityService: ActivityService) {
    this.activityList = activityService.getAllActivities();
  }

  loadMoreData(event) {
    setTimeout(() => {
      event.target.complete();
    }, 3000);
  }

  refresh(event) {
    setTimeout(() => {
      this.activityList = this.activityService.getAllActivities();
      event.target.complete();
    }, 3000);
  }
}