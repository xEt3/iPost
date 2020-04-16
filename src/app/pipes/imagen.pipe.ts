import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment.prod';

const url = environment.url

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(imagen: string, userId:string): string {
    return `${url}/post/imagen/${userId}/${imagen}`;
  }

}
