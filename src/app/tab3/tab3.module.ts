import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }]),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAJDUquUllqo1t5T_dHZ3YECZid5zpWumU',
      libraries: ['drawing', 'places']
    }),
  ],
  declarations: [Tab3Page]
})
export class Tab3PageModule {}
