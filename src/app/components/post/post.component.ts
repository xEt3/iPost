import { Component, OnInit, Input } from '@angular/core';
import { Post, Usuario } from '../../interfaces/interfaces';
import { PostsService } from '../../services/posts.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {

  @Input() post: Post = {};
  
  isliked=false;
  mostrarFotos=true;
  mostrarMapas=false;

  slideSoloOpt = {
    allowSlideNext: false,
    allowSlidePrev: false
  }

  constructor(private postService:PostsService,
    private usuarioService:UsuarioService) { }

  async ngOnInit() {
    if(this.post.coords && this.post.imgs.length===0 ){
      this.mostrarMapas=true
    }
    const currentUser:Usuario = await this.usuarioService.getCurrentUser();
    console.log(this.post)
    this.post.likes.forEach((like:any)=>{
      if(like._id==currentUser._id){
        this.isliked=true;
      }
    })
   }

  segmentChanged(event) {
      this.mostrarFotos=!this.mostrarFotos;
      this.mostrarMapas=!this.mostrarMapas;
  }

  async like(){
    console.log('like')
    this.postService.likePost(this.post._id).then((post)=>{
      console.log(post)
      if(post){
        this.post=post
        this.isliked=!this.isliked
        console.log(post)
      }
    });
  }
}
