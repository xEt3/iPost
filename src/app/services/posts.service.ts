import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { RespuestaPosts, Post } from '../interfaces/interfaces';
import { UsuarioService } from './usuario.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { resolve } from 'url';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  paginaPosts = 0;

  constructor(private http: HttpClient,
    private usuarioService: UsuarioService,
    private fileTransefer: FileTransfer) { }


  nuevoPost = new EventEmitter<Post>()

  crearPost(post) {
    return new Promise(resolve => {
      const headers = new HttpHeaders({
        'x-token': this.usuarioService.token
      })
      this.http.post(`${url}/post`, post, { headers }).subscribe(data => {
        console.log(data);
        if (data['ok']) {
          this.nuevoPost.emit(data['post']);
          return resolve(true);
        } else {
          return resolve(false);
        }
      });
    });
  }

  getPosts(pull: boolean = false) {
    if (pull) {
      this.paginaPosts = 0;
    }
    this.paginaPosts++;
    return this.http.get<RespuestaPosts>(`${url}/post/?pagina=${this.paginaPosts}`)
  }

  likePost(idPost:string){
    return new Promise(resolve=>{
      const headers = new HttpHeaders({
        'x-token': this.usuarioService.token
      })
      this.http.post(`${url}/post/like/${idPost}`,null,{headers}).subscribe((data:any)=>{
        if(data['ok']){
          return resolve(data.postDB);
        }else{
          return resolve(false)
        }
      })
    })
  }

  subirImagen(pathImg: string) {
    const options: FileUploadOptions = {
      fileKey: 'imagen',
      headers: {
        'x-token': this.usuarioService.token
      }
    };

    const fileTransfer: FileTransferObject = this.fileTransefer.create();
    fileTransfer.upload(pathImg, `${url}/post/upload`, options).then(data => {
      console.log(data)
    }).catch(console.log)
  }

}
