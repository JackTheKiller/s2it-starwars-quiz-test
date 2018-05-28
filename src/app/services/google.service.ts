import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GoogleService {

  API_KEY = 'AIzaSyCCRQcRvkX6AP3fZmpUzGSbgi1Rln0mefg';
  searchEngineID = '010865297085708502564:5v24f1tsfsu';
  customSearchURL = 'https://www.googleapis.com/customsearch/v1';

  constructor(
    private http: HttpClient
  ) { }

  searchImageFor(name) {
    const params = new HttpParams()
      .set('q', name)
      .set('imgSize', 'medium')
      .set('imgType', 'face')
      .set('searchType', 'image')
      .set('key', this.API_KEY)
      .set('cx', this.searchEngineID);

    return this.http.get(`${this.customSearchURL}`, { params }).pipe(map((data: any) => {
      const images = [];
      data.items.forEach(item => {
        images.push({
          url: item.link,
          mime: item.mime
        });
      });
      return images;
    }));
  }
}
