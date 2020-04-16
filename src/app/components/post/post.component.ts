import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../../interfaces/interfaces';
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

  ngOnInit() {
    if(this.post.coords && this.post.imgs.length===0 ){
      this.mostrarMapas=true
    }
    
    this.post.likes.forEach((like:any)=>{
      console.log(like)
      if(like._id==this.usuarioService.getUsuario()._id){
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
      if(post){
        this.post=post
        this.isliked=!this.isliked
        console.log(post)
      }
    });
  }
}
