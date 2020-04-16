import { Component, OnInit } from '@angular/core';
import { Usuario, Post } from '../../interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { NgForm } from '@angular/forms';
import { UIService } from '../../services/ui.service';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  usuario:Usuario={}
  
  constructor(private usuarioService:UsuarioService,
    private uiService:UIService,private postService:PostsService) {}

  ngOnInit(){
    this.usuario=this.usuarioService.getUsuario();
  }

  async actualizar(fActualizar:NgForm){
    if(fActualizar.valid){
      const actualizado = await this.usuarioService.actualizarUsuario(this.usuario)
      if(actualizado){
        this.uiService.presentToast("Actualizado")
      }else{
        this.uiService.presentToast('No se pudo actualizar')
      }
    }
  }

  logout(){
    this.usuarioService.logout();
    this.postService.paginaPosts=0;
  }


}
