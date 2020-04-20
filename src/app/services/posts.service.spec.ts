import { TestBed, inject } from '@angular/core/testing';

import { PostsService } from './posts.service';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { RouterModule } from '@angular/router';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { Post } from '../interfaces/interfaces';
import { CompileMetadataResolver } from '@angular/compiler';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

describe('PostsService', () => {

  let service: PostsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, IonicStorageModule.forRoot(), RouterModule.forRoot([])],
      providers: [PostsService, Geolocation, FileTransfer]
    })
    service = TestBed.get(PostsService);
    httpMock = TestBed.get(HttpTestingController);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getPosts()', () => {
    it('Should get the last 10 post', () => {
      service.getPosts().subscribe((data) => {
        expect(data).toBeDefined();
        expect(data.posts.length).toEqual(10);
      })
    });

    it('Should return the 10 next post', () => {
      service.getPosts(true).subscribe((data) => {
        service.getPosts().subscribe((data2) => {
          expect(data).toBeDefined();
          expect(data2).toBeDefined();
          // expect(data.posts.length).toEqual(10);
          // expect(data2.posts.length).toEqual(10);
          for (let i = 0; i < data.posts.length; i++) {
            expect(data.posts[i]._id).not.toEqual(data2.posts[i]._id);
          }
        })
      })
    });
  });

  describe('#getPost()', () => {
    it('Should get post', () => {
      service.getPosts().subscribe((data) => {
        service.getPost(data.posts[0]._id).subscribe((datapost: any) => {
          expect(datapost).toBeDefined();
          expect(data).toBeDefined();
          expect(datapost.post).toEqual(data.posts[0]);
        })
      })
    });

    it('Should return ok false, post id not exist', () => {
      service.getPost('123').subscribe((datapost: any) => {
        expect(datapost).toBeDefined();
        expect(datapost.ok).toEqual(false);
      })
    });
  });

  describe('delete Post', () => {
    it('Shold delete the last post posted', () => {
      service.getPosts().subscribe(async (data) => {
        const resp = await service.deletePost(data.posts[0]._id)
        expect(resp).toEqual(true);
        service.getPosts(true).subscribe(async (dataUpdated) => {
          expect(data.posts[0]).not.toEqual(dataUpdated.posts[0])
        })
      })
    });

    it('Shold return false, id post incorrect', async () => {
      const resp = await service.deletePost('1234');
      expect(resp).toEqual(false);
    });
  });
})
