import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class UserServiceService {
  constructor(private http: HttpClient) {}

  getProfile() {
    const token = sessionStorage.getItem("tokenLogin");
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Bearer " + token
    });
    return this.http.get(environment.api + "/users/get-profile/", {
      headers: reqHeader
    });
  }
  getupdateUser(l) {
    const token = sessionStorage.getItem("tokenLogin");
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    });
    return this.http.post(
      environment.api + "/users/get-updateuser/",
      { locat: l },
      { headers: reqHeader }
    );
  }

  getChatRoom() {
    const token = sessionStorage.getItem("tokenLogin");
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Bearer " + token
    });
    return this.http.get(environment.api + "/chat-rooms/getChat/", {
      headers: reqHeader
    });
  }

  getMessageActive(id) {
    console.log("id", id);
    const token = sessionStorage.getItem("tokenLogin");
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    });
    const obj = { refchat: id };
    return this.http.post(environment.api + "/messages/getMessage/", obj, {
      headers: reqHeader
    });
  }

  sendMessage(id, chatMessage, type) {
    const token = sessionStorage.getItem("tokenLogin");
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    });
    const obj = { refchat: id, message: chatMessage, message_type: type };
    return this.http.post(environment.api + "/messages/createMessage/", obj, {
      headers: reqHeader
    });
  }

  getUser() {
    const token = sessionStorage.getItem("tokenLogin");
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Bearer " + token
    });
    return this.http.get(environment.api + "/users/getuser/", {
      headers: reqHeader
    });
  }
  getUserGroup() {
    const token = sessionStorage.getItem("tokenLogin");
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Bearer " + token
    });
    return this.http.get(environment.api + "/users/getuserGroup/", {
      headers: reqHeader
    });
  }

  createChatRoom(pairname, names, typeroom) {
    const token = sessionStorage.getItem("tokenLogin");
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    });
    const obj = { user: pairname, name: names, type: typeroom };
    return this.http.post(environment.api + "/chat-rooms/createChat/", obj, {
      headers: reqHeader
    });
  }

  fcmToken(fcm) {
    const token = sessionStorage.getItem("tokenLogin");
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    });
    const obj = { fcmToken: fcm };
    return this.http.post(environment.api + "/users/fcmToken/", obj, {
      headers: reqHeader
    });
  }
}
