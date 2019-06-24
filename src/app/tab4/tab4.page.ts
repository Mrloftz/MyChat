import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { all } from "q";
import { NavController } from "@ionic/angular";
import { SocketService } from "../service/socket.service";
import { UserServiceService } from "../service/user-service.service";
import * as _ from "underscore";
import { FormsModule } from '@angular/forms';

@Component({
  selector: "app-tab4",
  templateUrl: "tab4.page.html",
  styleUrls: ["tab4.page.scss"]
})
export class Tab4Page implements OnInit {
  obj = [
    { name: "Germany", voteCount: 20 },
    { name: "Spain", voteCount: 30 },
    { name: "France", voteCount: 20 },
    { name: "Nigeria", voteCount: 30 }
  ];
  data = [];
  optional: any;
  Myprofile: any;
  disabledButton = true;
  isDisabled = true;

  constructor(
    private http: HttpClient,
    public nvCT: NavController,
    private socket: SocketService,
    public userService: UserServiceService
  ) {
    // this.genData();
  }
  pieChartData;
  confrim: any;
  datapoll: any;
  ngOnInit() {
    this.getprofile();
    this.useAngularLibrary();
    this.getPoll();
    // this.createPoll();
    this.socket.onActivePoll().subscribe(data => {
      console.log(data);
    });
  }
  useAngularLibrary() {
    this.pieChartData = {
      chartType: "PieChart",
      dataTable: this.data,
      options: {
        title: "Country",
        width: 400,
        height: 300
      }
    };
  }
  // genData() {
  //   this.data = [['Languages', 'Percent']];
  //   this.obj.forEach(element => {
  //     this.data.push([element.name, element.voteCount]);
  //     console.log("this.options", this.obj)
  //   });

  //   this.useAngularLibrary();
  // }
  sendVote(options) {
    if (options !== this.confrim) {
      this.confrim = options;
      this.isDisabled = !this.isDisabled;
      console.log(this.confrim);
    }
  }
  getPoll() {
    return this.http.get(environment.api + "/poll/getpoll").subscribe(res => {
      console.log(res);
      this.datapoll = res;
      console.log("this.datapoll", this.datapoll)
      this.datapoll.reverse();
    });
  }
  updatePoll(i) {
    i.choice.forEach(element => {
      if (element === this.confrim) {
        element.voteCount++;
      }
    });
    const list = i.user;
    list[list.length] = this.Myprofile._id;

    return this.http
      .put(environment.api + "/poll/poll", {
        choice: i.choice,
        _id: i._id,
        user: list
      })
      .subscribe(res => {
        console.log(res);
      });
  }
  getprofile() {
    this.userService.getProfile().subscribe(data => {
      this.Myprofile = data;
      console.log("AAA",this.Myprofile);
    });
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
  // createPoll() {
  //   return this.http
  //     .post(environment.api + "/poll/poll", {
  //       title: "aa",
  //       detail: "lalala",
  //       choice: [
  //         { name: "Germany", voteCount: 20 },
  //         { name: "Spain", voteCount: 30 },
  //         { name: "France", voteCount: 20 },
  //         { name: "Nigeria", voteCount: 30 }
  //       ],
  //       user: "ololo"
  //     })
  //     .subscribe(res => {
  //       console.log(res);
  //       this.datapoll = res;
  //     });
  // }

  gotoCreate() {
    this.nvCT.navigateForward("/tab4/create-poll");
  }
}
