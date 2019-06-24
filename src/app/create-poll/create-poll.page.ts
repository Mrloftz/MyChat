import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { NavController } from '@ionic/angular';
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
// import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from "@angular/router";
import { UserServiceService } from "../service/user-service.service";
@Component({
  selector: "app-create-poll",
  templateUrl: "./create-poll.page.html",
  styleUrls: ["./create-poll.page.scss"]
})
export class CreatePollPage implements OnInit {
  inputs = [
    {
      name: "Choice", vote: 0
    }
  ];
  // tslint:disable-next-line:variable-name
  close_date: '';
  user: any;
  public createpollForm = new FormGroup({
    title: new FormControl(),
    detail: new FormControl(),
    choice: new FormControl(),
    close_date: new FormControl()
  });
  dataUser: any;
  dataroom: any;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    public nvCT: NavController,
    public userService: UserServiceService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.dataroom = this.router.getCurrentNavigation().extras.state.user;
        console.log('dateUserPoll', this.dataroom);
      }
    });
  }

  ngOnInit() {
    this.createpollForm = this.formBuilder.group({
      title: ["", Validators.required],
      detail: ["", Validators.compose([Validators.required])],
      choice: [""],
      close_date: [""],
      CreatePollById: [""],
      ChatRoomId: [""],
    });
    this.getprofile();
  }
  deleatechoice() {
    this.inputs.pop();
  }

  getprofile() {
    this.userService.getProfile().subscribe(data => {
      this.user = data;
      console.log("this.profile", this.user);
    });
  }
  createpoll() {
    const timestamp = new Date(this.createpollForm.value.close_date).getTime();
    const obj = {
      title: this.createpollForm.value.title,
      detail: this.createpollForm.value.detail,
      choice: this.inputs,
      date: timestamp,
      refuser: this.user._id,
      refchat: sessionStorage.getItem('refChatroom')
    };
    console.log(obj);
    return this.http.post(environment.api + '/polls/poll', obj).subscribe(res => {
      console.log("orl", res);
      this.router.navigate(['/chatpoll']);
    });
  }
  writedata(e, i) {
    this.inputs[i].name = e;
    this.inputs[i].vote = 0;
    console.log("this.inputs", this.inputs);
  }
  adddata() {
    this.inputs.push({
      name: "Choice"
    });
  }


}
