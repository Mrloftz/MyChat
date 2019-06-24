import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { AuthService } from "./auth.service";
import { map, catchError } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthguardService {
  constructor(public auth: AuthService, private myRoute: Router) {}

  canActivate(): Observable<any> {
    return this.auth.isloggedin().pipe(
      map(res => {
        return res === true;
      }),
      catchError(error => {
        this.myRoute.navigate(["login"]);
        return of(false);
      })
    );
  }
}
