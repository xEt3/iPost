import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonSlides, NavController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { UIService } from '../../services/ui.service';
import { Usuario } from '../../interfaces/interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild("slideMain",{static:true})slidesMain:IonSlides;
  
  loginUser={
    email:'',
    password:''
  }

  registerUser:Usuario={
    email:'',
    password:'',
    nombre:'',
    avatar:'av-3.png'
  }

  constructor(private usuarioService:UsuarioService,
    private navController:NavController,
    private uiService :UIService) { }

  async ngOnInit() {
     await this.slidesMain.lockSwipes(true);
  }

  async login(fLogin: NgForm) {
    if(fLogin.valid){
      const valido = await this.usuarioService.login(this.loginUser.email,this.loginUser.password);
      if(valido){
        this.navController.navigateRoot('main/tabs/tab1',{animated:true});
      }else{
        this.uiService.alertaInformativa('Usuario o contraseña incorrectos')
      }
    }
  }

  async registro(fRegistro:NgForm){
    const valido = await this.usuarioService.registro(this.registerUser)
    if(valido){
      this.navController.navigateRoot('main/tabs/tab1',{animated:true});
    }else{
      this.uiService.alertaInformativa('El correo electronico ya existe')
    }
  }

  async mostrarRegistro(){
   await this.slidesMain.lockSwipes(false);
   await  this.slidesMain.slideTo(1);
   await this.slidesMain.lockSwipes(true);
  }

  async mostarIngresar(){
    await this.slidesMain.lockSwipes(false);
    await  this.slidesMain.slideTo(0);
    await this.slidesMain.lockSwipes(true);
  }


}
