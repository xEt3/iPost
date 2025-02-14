import { Component, OnInit, Output, EventEmitter, Input, ApplicationRef } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-avatar-selector',
  templateUrl: './avatar-selector.component.html',
  styleUrls: ['./avatar-selector.component.scss'],
})
export class AvatarSelectorComponent implements OnInit {

  @Output() avatarSel = new EventEmitter<string>()
  @Input() img:string='av-1.png';

  avatarSlide={
    slidesPerView:3.5
  }

  constructor() { }

  ngOnInit() {
    if(this.img){
      this.seleccionarAvatar(this.avatars.find(av=>av.img===this.img))
    }
  }

  seleccionarAvatar(avatar){
    this.avatars.forEach(av=>{
      av.seleccionado=false;
    });
    avatar.seleccionado=true;
    this.avatarSel.emit(avatar.img);
  }


  avatars = [
    {
      img: 'av-1.png',
      seleccionado: true
    },
    {
      img: 'av-2.png',
      seleccionado: false
    },
    {
      img: 'av-3.png',
      seleccionado: false
    },
    {
      img: 'av-4.png',
      seleccionado: false
    },
    {
      img: 'av-5.png',
      seleccionado: false
    },
    {
      img: 'av-6.png',
      seleccionado: false
    },
    {
      img: 'av-7.png',
      seleccionado: false
    },
    {
      img: 'av-8.png',
      seleccionado: false
    },
  ];
}
