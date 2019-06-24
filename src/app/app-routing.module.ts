import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthguardService } from './service/authguard.service';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'home', loadChildren: './tabs/tabs.module#TabsPageModule', canActivate: [AuthguardService] },
  { path: 'tab2/chatroom', loadChildren: '../app/chatroom/chatroom.module#ChatroomPageModule' },
  { path: 'modalpage', loadChildren: './modalpage/modalpage.module#ModalpagePageModule' },
  { path: 'createtimeline', loadChildren: './createboardcast/createboardcast.module#CreateboardcastPageModule' },
  { path: 'tab4/create-poll', loadChildren: './create-poll/create-poll.module#CreatePollPageModule' },
  { path: 'chatpoll', loadChildren: './chatpoll/chatpoll.module#ChatpollPageModule' },
  { path: 'creategroup', loadChildren: './creategroup/creategroup.module#CreategroupPageModule' },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
  { path: 'timeline', loadChildren: './tab3/tab3.module#Tab3PageModule'},  { path: 'pollhistory', loadChildren: './pollhistory/pollhistory.module#PollhistoryPageModule' },



];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
