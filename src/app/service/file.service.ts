import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
// import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
// import { File } from '@ionic-native/file';

@Injectable({
    providedIn: 'root'
})
export class FileServiceService {

    constructor(private http: HttpClient,
        private imagePicker: ImagePicker,
        // private transfer: FileTransfer,
        // private file: File
        ) {
    }

    postImg(img) {
        const token = sessionStorage.getItem('tokenLogin');
        const reqHeader = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + token
        });

        return this.http.post(environment.api + '/files/postFile', { img }, { headers: reqHeader });
    }


    // fileUpload() {
    //     const token = sessionStorage.getItem('tokenLogin');
    //     const reqHeader = new HttpHeaders({
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //         'Authorization': 'Bearer ' + token
    //     });
    //     const fileTransfer: FileTransferObject = this.transfer.create()

    //     let options: FileUploadOptions = {
    //         fileKey: 'file',
    //         fileName: 'name1.jpg',
    //         headers: {reqHeader}
    //     }

    //     fileTransfer.upload('file:///data/user/0/io.ionic.starter/cache/tmp_Screenshot_2019-06-05-10-48-12-344_com.android.chrome4131693962399447029.png', 'http://192.168.0.182:3000/v1/files/postFile', options)
    //         .then((data) => {
    //             console.log("uploadtest :", data)
    //         }, (err) => {
    //             console.log("err :", err)
    //         })
    // }

}
