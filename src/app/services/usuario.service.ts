import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { Usuario } from '../interfaces/interfaces';
import { NavController } from '@ionic/angular';
import { UIService } from './ui.service';

const url = environment.url

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  urll=url
  token = null;
  private usuario: Usuario = {};

  constructor(private storage: Storage,
    private http: HttpClient,
    private navController: NavController,
    private uis:UIService) { }

  login(email: string, password: string) {
    return new Promise(resolve => {
      const data = { email, password };
      this.http.post(`${url}/user/login`, data).subscribe(async data => {
        if (data['ok']) {
          await  this.guardarToken(data['token']);
          resolve(true);
        } else {
          this.token = null
          this.storage.clear();
          resolve(false);
        }
      });
    });
  }

  logout(){
    this.token=null;
    this.usuario=null;
    this.storage.clear();
    this.navController.navigateRoot('/login',{animated:true});
  }

  registro(usuario: Usuario) {
    return new Promise(resolve => {
      this.http.post(`${url}/user/create`, usuario).subscribe(async resp => {
        if (resp['ok']) {
          await this.guardarToken(resp['token']);
          resolve(true);
        } else {
          this.token = null
          this.storage.clear();
          resolve(false);
        }
      })
    })
  }

  actualizarUsuario(usuario: Usuario) {
    return new Promise(resolve => {
      const headers = new HttpHeaders({
        'x-token': this.token
      })
      this.http.post(`${url}/user/update`, usuario, { headers }).subscribe(resp => {
        if (resp['ok']) {
          this.guardarToken(resp['token']);
          return resolve(true);
        } else {
          return resolve(false);
        }
      })
    })
  }

  getUsuario() {
    if (!this.usuario._id) {
      this.validaToken();
    }
    return { ...this.usuario }
  }

  async guardarToken(token: string) {
    this.token = token;
    await this.storage.set('token', token);
    await this.validaToken()
  }

  async cargarToken() {
    this.token = await this.storage.get('token') || null;
  }

  async validaToken(): Promise<boolean> {
    await this.cargarToken();
    if (!this.token) {
      this.navController.navigateRoot('/login');
      return Promise.resolve(false);
    }
    return new Promise<boolean>(resolve => {
      const headers = new HttpHeaders({
        'x-token': this.token
      })
      this.http.get(`${url}/user/`, { headers }).subscribe(resp => {
        if (resp['ok']) {
          this.usuario = resp['usuario'];
          resolve(true);
        } else {
          this.navController.navigateRoot('/login');
          resolve(false)
        }
      })
    });
  }

}
