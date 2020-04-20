import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { RespuestaPosts, Post, RespuestaSubidaImagen } from '../interfaces/interfaces';
import { UsuarioService } from './usuario.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { resolve } from 'url';

const url = `${environment.url}/post`;

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  paginaPosts = 0;

  constructor(private http: HttpClient,
    private usuarioService: UsuarioService,
    private fileTransefer: FileTransfer) { }


  nuevoPost = new EventEmitter<Post>()

  //new post
  newPost(post: Post) {
    return new Promise(resolve => {
      const headers = new HttpHeaders({
        'x-token': this.usuarioService.token
      })
      this.http.post(`${url}`, post, { headers }).subscribe(data => {
        if (data['ok']) {
          this.nuevoPost.emit(data['post'])
          return resolve(data);
        } else {
          return resolve(false);
        }
      });
    });
  }

  // Get posts on pages from 10 post
  getPosts(reset: boolean = false) {
    if (reset) {
      this.paginaPosts = 0;
    }
    this.paginaPosts++;
    return this.http.get<RespuestaPosts>(`${url}/?pagina=${this.paginaPosts}`);
  }

  //Get post by id
  getPostByid(idPost: string) {
    return this.http.get<RespuestaPosts>(`${url}/get/${idPost}`);
  }

  //Delete post
  deletePost(idPost: string) {
    return new Promise((resolve) => {
      const headers = new HttpHeaders({
        'x-token': this.usuarioService.token
      })
      this.http.delete<RespuestaPosts>(`${url}/remove/${idPost}`, { headers }).subscribe(data => {
        if (data['ok']{
          console.log(data)
          return resolve(true)
        } else {
          return resolve(false)
        }
      });
    })
  }

  //Delete temp file
  deleteTempFile(imageName: string) {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    })
    return new Promise((resolve) => {
      this.http.delete(`${url}/image/temp/${imageName}`, { headers }).subscribe((data) => {
        if (data[`ok`]) {
          resolve(data);
        } else {
          resolve(false);
        }
      })
    })
  }

  //Delete temp folder
  deleteTempFolder() {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    })
    return new Promise(resolve => {
      this.http.delete(`${url}/image/temp`, { headers }).subscribe(data => {
        if (data['ok']) {
          return resolve(data);
        } else {
          return resolve(false);
        }
      })
    })
  }

  // like/dislike post
  likePost(idPost: string) {
    return new Promise(resolve => {
      const headers = new HttpHeaders({
        'x-token': this.usuarioService.token
      })
      this.http.post(`${url}/post/like/${idPost}`, null, { headers }).subscribe((data: any) => {
        if (data['ok']) {
          return resolve(data.postDB);
        } else {
          return resolve(false)
        }
      })
    })
  }

  //Get Image post
  uploadImage(pathImg: string) {
    return new Promise(resolve => {
      const options: FileUploadOptions = {
        fileKey: 'imagen',
        headers: {
          'x-token': this.usuarioService.token
        }
      };
      const fileTransfer: FileTransferObject = this.fileTransefer.create();
      fileTransfer.upload(pathImg, `${url}/post/upload`, options).then((data: any) => {
        resolve(JSON.parse(data.response))
      }).catch(console.log)

    })
  }

  //Add comment to post
  addCommentToPost(commentText: string, idPost: string) {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    })
    return new Promise(resolve => {
      this.http.post(`${url}/comment/${idPost}`, { text: commentText }, { headers }).subscribe(data => {
        if (data['ok']) {
          return resolve(data['post'])
        } else {
          return resolve(false);
        }
      })
    })
  }

  //delete comment
  deleteComment(idPost: string, idComment: string) {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    })
    return new Promise(resolve => {
      this.http.delete(`${url}/comment/${idPost}/${idComment}`, { headers }).subscribe(data => {
        if (data['ok']) {
          resolve(data['post']);
        } else {
          resolve(false);
        }
      })
    });
  }

}





