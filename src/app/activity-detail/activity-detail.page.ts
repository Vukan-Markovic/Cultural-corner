import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Activity } from '../types';
import { ActivityService } from '../activity.service';
import { ActivatedRoute } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { ActivityVideoPage } from '../activity-video/activity-video.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Plugins } from '@capacitor/core';

const { Toast } = Plugins;

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.page.html',
  styleUrls: ['./activity-detail.page.scss'],
})
export class ActivityDetailPage implements OnInit {
  activityDetail: Observable<Activity>;

  constructor(private _toastController: ToastController, private _angularFireStore: AngularFirestore, private _angularFireAuth: AngularFireAuth, activityService: ActivityService, activatedRoute: ActivatedRoute, private _modalController: ModalController, private _socialShare: SocialSharing) {
    const activityID = activatedRoute.snapshot.params["activityID"];
    this.activityDetail = activityService.getActivity(activityID);
  }

  ngOnInit() {
  }

  share() {
    this.activityDetail.subscribe((activity) => {
      this._socialShare.share("Look what I found on this app called Rana", activity.name, "", activity.cropped);
    })
  }

  addToFavorites() {
    this.activityDetail.subscribe((activity) => {
      this._angularFireStore
        .collection("favorites")
        .doc(this._angularFireAuth.auth.currentUser.uid)
        .collection("favorites", (ref) => {
          return ref.where("id", "==", activity.id)
        })
        .get()
        .subscribe((doc) => {
          if (doc.empty) {
            this._angularFireStore
              .collection("favorites")
              .doc(this._angularFireAuth.auth.currentUser.uid)
              .collection("favorites")
              .add(activity)
              .then(() => {
                //   const toast = this._toastController.create({
                //     message: "The activity " + activity.name + " was added to your favorites",
                //     duration: 3500,
                //     position: "top"
                //   });
                //   toast
                //     .then((toastMessage) => {
                //       toastMessage.present();
                //     })
                Toast.show({
                  text: "The activity " + activity.name + " was added to your favorites"
                })
              });
          }
        })
    });
  }

  async openModal() {
    const videoModal = await this._modalController.create({
      component: ActivityVideoPage
    });

    return await this.activityDetail.subscribe((activity) => {
      videoModal.componentProps = {
        videoURL: activity.video_url
      };

      return videoModal.present();
    });
  }
}