import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { Usuario, FollowResponse, UserResponse, UsersReponse } from '../interfaces/interfaces';
import { NavController } from '@ionic/angular';
import { UIService } from './ui.service';

const url = environment.url

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  token = null;
  private usuario: Usuario = {};
  private usersPage:number=0;

  constructor(private storage: Storage,
    private http: HttpClient,
    private navController: NavController,
    private uis: UIService) { }

  register(user: Usuario) {
    return new Promise(resolve => {
      this.http.post(`${url}/user/create`, user).subscribe(async resp => {
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

  login(email: string, password: string) {
    return new Promise(resolve => {
      const data = { email, password };
      this.http.post(`${url}/user/login`, data).subscribe(async data => {
        if (data['ok']) {
          await this.guardarToken(data['token']);
          resolve(true);
        } else {
          this.token = null
          this.storage.clear();
          resolve(false);
        }
      });
    });
  }

  followUnFollowUser(idUsuario: string) {
    const headers = new HttpHeaders({
      'x-token': this.token
    })
    return new Promise<Usuario>((resolve) => {
      this.http.post<FollowResponse>(`${url}/user/follow/${idUsuario}`, null, { headers }).subscribe(data => {
        if (data.ok) {
          this.usuario = data.usuario
          return resolve(data.usuarioToFollow);
        } else {
          return resolve(null);
        }
      });
    })
  }

  logout() {
    this.token = null;
    this.usuario = null;
    this.storage.clear();
    this.navController.navigateRoot('/login', { animated: true });
  }


  updateUser(usuario: Usuario) {
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

  async getCurrentUser() {
    if (!this.usuario._id) {
      await this.validaToken();
    }
    return { ...this.usuario }
  }

  getUser(idUser:string){
    return new Promise<Usuario>(resolve =>{
      this.http.get<UserResponse>(`${url}/user/${idUser}`).subscribe(data=>{
        if(data.ok){
          return resolve(data.user)
        }else{
          return resolve(null);
        }
      })
    })
  }

  getUsers(reset=false){
    return new Promise<Usuario[]>(resolve=>{
      if(reset){
        this.usersPage=0
      }
      this.usersPage++;
      this.http.get<UsersReponse>(`${url}/user/?pagina=${this.usersPage}`).subscribe(data=>{
        if(data.ok){
          return resolve(data.users);
        }else{
          return resolve([])
        }
      })
    })
  }

  private async guardarToken(token: string) {
    this.token = token;
    await this.storage.set('token', token);
    await this.validaToken()
  }

  async cargarToken() {
    this.token = await this.storage.get('token') || null;
  }

  private async validaToken(): Promise<boolean> {
    await this.cargarToken();
    if (!this.token) {
      this.navController.navigateRoot('/login');
      return Promise.resolve(false);
    }
    return new Promise<boolean>(resolve => {
      const headers = new HttpHeaders({
        'x-token': this.token
      })
      this.http.get(`${url}/user/me`, { headers }).subscribe(resp => {
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
