import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/sign-in',
    pathMatch: 'full'
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./sign-in/sign-in.module').then( m => m.SignInPageModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
  {
    path: 'open-requests-main',
    loadChildren: () => import('./open-requests-main/open-requests-main.module').then( m => m.OpenRequestsMainPageModule)
  },
  {
    path: 'requests-history',
    loadChildren: () => import('./requests-history/requests-history.module').then( m => m.RequestsHistoryPageModule)
  },
  {
    path: 'groups',
    loadChildren: () => import('./groups/groups.module').then( m => m.GroupsPageModule)
  },
  {
    path: 'group-add',
    loadChildren: () => import('./group-add/group-add.module').then( m => m.GroupAddPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'request-add',
    loadChildren: () => import('./request-add/request-add.module').then( m => m.RequestAddPageModule)
  },
  {
    path: 'feedback',
    loadChildren: () => import('./feedback/feedback.module').then( m => m.FeedbackPageModule)
  },
  {
    path: 'my-applies',
    loadChildren: () => import('./my-applies/my-applies.module').then( m => m.MyAppliesPageModule)
  },{
    path: 'my-requests',
    loadChildren: () => import('./my-requests/my-requests.module').then( m => m.MyRequestsPageModule)
  },
  {
    path: 'open-requests-forme',
    loadChildren: () => import('./open-requests-forme/open-requests-forme.module').then( m => m.OpenRequestsForMePageModule)
  },
  {
    path: 'open-requests-nearby',
    loadChildren: () => import('./open-requests-nearby/open-requests-nearby.module').then( m => m.OpenRequestsNearbyPageModule)
  },
  {
    path: 'request-to-apply',
    loadChildren: () => import('./request-to-apply/request-to-apply.module').then( m => m.RequestToApplyPageModule)
  },
  {
    path: 'alert-to-show',
    loadChildren: () => import('./alert-to-show/alert-to-show.module').then( m => m.AlertToShowPageModule)
  },
  {
    path: 'group-members',
    loadChildren: () => import('./group-members/group-members.module').then( m => m.GroupMembersPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'kids',
    loadChildren: () => import('./kids/kids.module').then( m => m.KidsPageModule)
  },
  {
    path: 'add-kids',
    loadChildren: () => import('./add-kids/add-kids.module').then( m => m.AddKidsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'identification',
    loadChildren: () => import('./identification/identification.module').then( m => m.IdentificationPageModule)
  },
  {
    path: 'show-applies',
    loadChildren: () => import('./show-applies/show-applies.module').then( m => m.ShowAppliesPageModule)
  },
  {
    path: 'my-preffered-requests',
    loadChildren: () => import('./my-preffered-requests/my-preffered-requests.module').then( m => m.MyPrefferedRequestsPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
