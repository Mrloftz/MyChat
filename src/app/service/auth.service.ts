import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { tap } from "rxjs/operators";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private http: HttpClient) {}

  isloggedin() {
    const token =
      sessionStorage.getItem("tokenLogin") ||
      localStorage.getItem("tokenLogin");
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + token
    });
    return this.http
      .get(environment.api + "/users/get-profile/", { headers: reqHeader })
      .pipe(
        map(res => {
          sessionStorage.setItem("tokenLogin", token);
          return true;
        }),
        catchError(e => throwError(e))
      );
  }

  login(credential) {
    return this.http.post(environment.api + "/users/login", credential).pipe(
      tap(
        (data: any) => {
          sessionStorage.setItem("tokenLogin", data.token);
        },
        error => {
          console.log(error);
        }
      )
    );
  }

  getProfile() {
    const token = sessionStorage.getItem('tokenLogin');
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + token
    });
    return this.http.get(environment.api + '/users/get-profile/', { headers: reqHeader });
  }

  logout() {
    const token = sessionStorage.getItem('tokenLogin');
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + token
    });
    return this.http.get(environment.api + '/users/logout/', { headers: reqHeader });
  }
}
