import { NgModule , NO_ERRORS_SCHEMA } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from 'shared-library/shared/shared.module';
import { DashboardRoutingModule } from './routing/dashboard-routing.module';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { GameCardComponent } from './component/game-card/game-card.component';
import { NewsletterComponent } from './component/newsletter/newsletter.component';
import { BlogComponent } from './component/blog/blog.component';
import { effects, reducer } from './store';
import { LeaderboardComponent } from './component/leaderboard/leaderboard.component';
import { RealtimeStatsComponent } from './component/realtime-stats/realtime-stats.component';
import { QuestionComponent } from './component/question/question.component';
import { FriendInviteComponent } from './component/friend-invite/friend-invite.component';
import { GameInviteComponent } from './component/game-invite/game-invite.component';
import { NativeScriptRouterModule } from 'nativescript-angular/router';


@NgModule({
    declarations: [
        DashboardComponent,
        GameCardComponent,
        QuestionComponent,
        BlogComponent,
        NewsletterComponent,
        LeaderboardComponent,
        RealtimeStatsComponent,
        FriendInviteComponent,
        GameInviteComponent
    ],
    imports: [
        DashboardRoutingModule,
        NativeScriptRouterModule,
        SharedModule,
        StoreModule.forFeature('dashboard', reducer),
        EffectsModule.forFeature(effects),
    ],
    providers: [],
    exports: [],
    entryComponents: [
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class DashboardModule {
    constructor() { }
}
