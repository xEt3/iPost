import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { Post, Usuario } from '../../interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  posts: Post[] = []
  infineScrollHabilitado=true;

  constructor(private postsService: PostsService,
    private usuarioService:UsuarioService) { }

  ngOnInit() {
    this.siguientes();
    this.postsService.nuevoPost.subscribe(post=>{
      this.posts.unshift(post);
    })
  }

  recargar(ev){
    this.infineScrollHabilitado=true;
    this.posts=[];
    this.siguientes(ev,true)
  }

  siguientes(ev?,pull:boolean=false) {
    this.postsService.getPosts(pull).subscribe(data => {
      this.posts.push(...data.posts)
      if(ev){
        ev.target.complete();
        if(data.posts.length===0){
          this.infineScrollHabilitado=false;
        }
      }
    })
  }


}
