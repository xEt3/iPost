import { Component } from '@angular/core';
import { Post } from '../../interfaces/interfaces';
import { PostsService } from '../../services/posts.service';
import { NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

declare var window:any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  cargandoGeo=false;
  tempImages: string[] = []

  post = {
    mensaje: '',
    coords: null,
    posicion: false
  }

  constructor(private postService: PostsService,
    private navController:NavController,
    private geoLocation:Geolocation,
    private camera:Camera) { }
  

  async crearPost() {
    const creado = await this.postService.crearPost(this.post);
    if (creado) {
      this.limpiarCampos();
      this.navController.navigateRoot('/main/tabs/tab1')
    }
  }

  private limpiarCampos() {
    this.post = {
      mensaje: '',
      coords: null,
      posicion: false
    }
    this.tempImages=[]
  }

  getGeo(){ 
    if(this.post.posicion){
      this.cargandoGeo=true;
      this.geoLocation.getCurrentPosition().then(resp=>{
        this.cargandoGeo=false;
        const coords = `${resp.coords.latitude},${resp.coords.longitude}`;
        this.post.coords=coords
        console.log(this.post)
      })
    }else{
      this.post.coords=null;
      this.cargandoGeo=false;  
    }
  }

  camara(){
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation:true,
      sourceType: this.camera.PictureSourceType.CAMERA
    }
    this.procesarImagen(options);
  }

  galeria(){
    console.log(this.galeria)
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation:true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    this.procesarImagen(options);
  }

  procesarImagen(options:CameraOptions){
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
 
      const img = window.Ionic.WebView.convertFileSrc(imageData);
      this.postService.subirImagen(imageData);
      this.tempImages.push(img);
 
     //  let base64Image = 'data:image/jpeg;base64,' + imageData;
 
      console.log(this.tempImages)
     }, (err) => {
      // Handle error
     });
  }

}
