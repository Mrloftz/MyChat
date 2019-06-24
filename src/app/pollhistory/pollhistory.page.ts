import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NavController } from '@ionic/angular';
import * as _ from 'underscore';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { UserServiceService } from '../service/user-service.service';

@Component({
  selector: 'app-pollhistory',
  templateUrl: './pollhistory.page.html',
  styleUrls: ['./pollhistory.page.scss'],
})
export class PollhistoryPage implements OnInit {

  Myprofile: any;
  datapoll: any;
  pieChartData;

  title = '';
  selectedOptions = '';

  constructor(public userService: UserServiceService, public nvCT: NavController, private http: HttpClient) { }

  ngOnInit() {
    this.getprofile();
    this.getPoll();
  }
  getprofile() {
    this.userService.getProfile().subscribe(data => {
      this.Myprofile = data;
      console.log('Myprofile', this.Myprofile);
    });
  }

  getPoll() {
    return this.http.post(environment.api + '/polls/getpoll', { id: sessionStorage.getItem('refChatroom') }).subscribe(res => {
      this.datapoll = res;
      this.datapoll.reverse();
      // this.datapoll.forEach(element => {
      //   element.timestamp = new Date(element.date).getTime() / 1000;
      // });
      console.log('this.datapoll', this.datapoll);

    });
  }

  useAngularLibrary(data) {
    this.pieChartData = {
      chartType: 'PieChart',
      dataTable: data,
      options: {
        title: this.title,
        width: 400,
        height: 300
      }
    };
  }
  genData(data: any) {
    this.title = data.title;
    console.log('this.title', this.title);
    const list = [['choice', 'Vote']];
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < data.choice.length; index++) {
      list[index + 1] = Object.values(data.choice[index]);
    }
    this.useAngularLibrary(list);
  }
}
