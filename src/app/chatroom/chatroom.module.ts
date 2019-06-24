import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatroomPage } from './chatroom.page';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Ng2GoogleChartsModule,
    RouterModule.forChild([{ path: '', component: ChatroomPage }])
  ],
  declarations: [ChatroomPage]
})
export class ChatroomPageModule {}
