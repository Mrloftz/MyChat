import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../service/auth.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}
  loginForm: FormGroup;
  logedin = true;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
    const token = localStorage.getItem("tokenLogin");
    const sess = sessionStorage.getItem("tokenLogin");

    if (token != null && sess !== undefined) {
      this.logedin = true;
      this.authService.isloggedin().subscribe(x => {
        this.router.navigate(["home/tab1"]);
      });
    } else if (token === null && sess !== undefined) {
      sessionStorage.removeItem("tokenLogin");
    }
  }

  onSubmit() {
    this.authService.login(this.loginForm.value).subscribe(
      data => {
        if (this.logedin === true) {
          localStorage.setItem("tokenLogin", data.token);
        }
        this.router.navigate(["home/tab1"]);
      },
      error => {
        console.log("error", error);
      }
    );
  }
}
