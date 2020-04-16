import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../../interfaces/interfaces';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {

  @Input() post: Post = {};

  mostrarFotos=true;
  mostrarMapas=false;

  slideSoloOpt = {
    allowSlideNext: false,
    allowSlidePrev: false
  }

  constructor() { }

  ngOnInit() {
    if(this.post.coords && this.post.imgs.length===0 ){
      this.mostrarMapas=true
    }
   }

  segmentChanged(event) {
      this.mostrarFotos=!this.mostrarFotos;
      this.mostrarMapas=!this.mostrarMapas;
  }
}
