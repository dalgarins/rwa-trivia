import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ModalDialogService } from 'nativescript-angular/directives/dialogs';
import { RouterExtensions } from 'nativescript-angular/router';
import { getImage } from 'nativescript-screenshot';
import * as SocialShare from "nativescript-social-share";
import * as Toast from 'nativescript-toast';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Utils, WindowRef } from 'shared-library/core/services';
import { coreState } from 'shared-library/core/store';
import { UserActions } from 'shared-library/core/store/actions';
import { AppState, appState } from '../../../store';
import { gamePlayState } from '../../store';
import { GameOver } from './game-over';
import { ReportGameComponent } from './../report-game/report-game.component';
import { Image } from "tns-core-modules/ui/image";

@Component({
  selector: 'game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class GameOverComponent extends GameOver implements OnInit, OnDestroy {
  stackLayout;
  showQuesAndAnswer: Boolean = true;
  constructor(public store: Store<AppState>, public userActions: UserActions,
    private windowRef: WindowRef, public utils: Utils,
    private modal: ModalDialogService, private vcRef: ViewContainerRef,
    public cd: ChangeDetectorRef, private routerExtensions: RouterExtensions) {
    super(store, userActions, utils, cd);


    this.subscriptions.push(this.store.select(gamePlayState).pipe(select(s => s.saveReportQuestion)).subscribe(state => {
      this.cd.markForCheck();
    }));
    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.userProfileSaveStatus)).subscribe((status: string) => {
      if (status && status !== 'NONE' && status !== 'IN PROCESS' && status !== 'SUCCESS' && status !== 'MAKE FRIEND SUCCESS') {
        Toast.makeText(status).show();
        this.disableFriendInviteBtn = true;
      }
      this.cd.markForCheck();
    }));

    this.subscriptions.push(this.store.select(appState.dashboardState).pipe(select(s => s.socialShareImageUrl)).subscribe(uploadTask => {
      if (uploadTask != null) {
        if (uploadTask.task.snapshot.state === 'success') {
          const path = uploadTask.task.snapshot.metadata.fullPath.split('/');
          // tslint:disable-next-line:max-line-length
          const url = `https://${this.windowRef.nativeWindow.location.hostname}/app/game/social/${this.user.userId}/${path[path.length - 1]}`;
          this.socialFeedData.share_status = true;
          this.socialFeedData.link = url;
          this.loaderStatus = false;
        }
      } else {
        this.socialFeedData.share_status = false;
        this.loaderStatus = false;
      }
      this.cd.markForCheck();
    }));
  }
  ngOnInit() {
    if (this.game) {
      this.otherUserId = this.game.playerIds.filter(userId => userId !== this.user.userId)[0];
      this.otherUserInfo = this.userDict[this.otherUserId];
    }
  }

  shareScore() {
    this.loaderStatus = true;
    this.playerUserName = this.user.displayName;
  }

  ngOnDestroy() {
    this.destroy();
  }

  openDialog(question) {
    const options = {
      context: { 'question': question, 'user': this.user, 'game': this.game, 'userDict': this.userDict },
      fullscreen: false,
      viewContainerRef: this.vcRef
    };
    this.modal.showModal(ReportGameComponent, options);
  }

  stackLoaded(args) {
    this.stackLayout = args.object;
  }

  reMatchGame() {
    if (this.applicationSettings.lives.enable && this.account.lives === 0) {
      Toast.makeText(this.liveErrorMsg).show();
    } else {
      this.reMatch();
    }
  }

  screenshot() {
    this.playerUserName = this.user.displayName;
    // we need to put setTimeout because to change username before screenshot.
    setTimeout(() => {
      const img = new Image;
      img.imageSource = getImage(this.stackLayout);
      const shareImage = img.imageSource;
      SocialShare.shareImage(shareImage);
      this.playerUserName = 'You';
    }, 100);
  }

  gotoDashboard() {
    this.routerExtensions.navigate(['/dashboard'], { clearHistory: true });
  }
}
