import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Chart } from 'chart.js';
import { UserServiceService } from '../service/user-service.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as _ from 'underscore';
import * as moment from 'moment';


@Component({
  selector: 'app-chatpoll',
  templateUrl: './chatpoll.page.html',
  styleUrls: ['./chatpoll.page.scss'],
})
export class ChatpollPage implements OnInit {
  today: string = moment().format('D MMM YYYY');
  obj = [
    { name: "Germany", voteCount: 20 },
    { name: "Spain", voteCount: 30 },
    { name: "France", voteCount: 20 },
    { name: "Nigeria", voteCount: 30 },
    { name: "test", voteCount: 50 },
    { name: "hello", voteCount: 80 },
    { name: "yo", voteCount: 10 }
  ];
  hidediv = true;
  Myprofile: any;
  datapoll: any;
  confrim: any;

  disabledButton = true;
  isDisabled = true;
  selectedOptions = '';

  title = '';
  date = '';
  data = [];
  polla = [];
  loadingController: any;
  api: any;
  datalabel: any;
  pieChartData;
  datapie: any;
  options: any;
  time: any;
  show: number;
  constructor(public nvCT: NavController, public userService: UserServiceService, private http: HttpClient) {

  }

  ngOnInit() {
    this.getprofile();
    this.getPoll();
    // this.setTime();
    // this.useAngularLibrary();
    // this.useAnotherOneWithWebpack();
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

  radioChangeHandler(event: any) {
    console.log('eee', event);
    this.selectedOptions = event.target.value;
    console.log('this.selectedOptions', this.selectedOptions);
  }
  radioChangeCheck(i) {
    if (this.selectedOptions !== '') {
      return false;
    } else {
      return true;
    }
  }
  updatePoll(i) {
    const Choices = this.selectedOptions;
    console.log('ss', i);
    i.choice.forEach(element => {
      if (element.name === Choices) {
        element.vote++;
      }
    });

    const list = i.user;
    console.log("list", list);
    list[list.length] = this.Myprofile._id;
    console.log("list", list);

    return this.http
      .post(environment.api + '/polls/updatePoll', {
        choice: i.choice,
        _id: i._id,
        user: list
      })
      .subscribe(res => {
        console.log(res);
      });
  }

  // sendVote(options) {
  //   if (options !== this.confrim) {
  //     this.confrim = options;
  //     // this.isDisabled = !this.isDisabled;
  //     console.log(this.confrim);
  //   }
  // }
  caltime(date) {
    const nowDate = new Date().getTime();
    return Math.round((date - nowDate) / (24 * 3600000));
  }
  checkVote(i) {
    const list = _.indexOf(i.user, this.Myprofile._id);
    // if(_.where(i.user,this.Myprofile.username))
    if (list !== -1) {
      return false;
    } else {
      return true;
    }
  }
  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // useAnotherOneWithWebpack(data) {
  //   const ctx = document.getElementById('myChart');
  //   const listdata = [];
  //   const listtitle = [];
  //   const color = [];
  //   data.choice.forEach(element => {
  //     listtitle.push(element.name);
  //     listdata.push(element.voteCount);
  //     color.push(this.getRandomColor());
  //   });
  //   const Mychart = new Chart(ctx, {
  //     type: 'pie',
  //     data: {
  //       labels: listtitle,
  //       datasets: [{
  //         data: listdata,
  //         backgroundColor: color
  //       }]
  //     },
  //   });
  // }

  // go to Pollhistory
  gotoCreate() {
    this.nvCT.navigateForward('/pollhistory');
  }
  // draw pie chart
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
  // gen dataPoll
  genData(data: any) {
    this.title = data.title;
    console.log('this.title', data);
    const list = [['Choices', 'Vote']];
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < data.choice.length; index++) {
      list[index + 1] = Object.values(data.choice[index]);
    }
    this.useAngularLibrary(list);
  }

  onclick() {
    this.hidediv = false;
  }
  // set moment days left
  // setTime() {
  //   const a = moment().endOf('month');
  //   console.log("a", a);
  //   const b = moment();
  //   console.log("b"+, b);
  //   this.show = a.diff(b, 'days');
  //   console.log('aaaaaa', this.show);
  // }

}
