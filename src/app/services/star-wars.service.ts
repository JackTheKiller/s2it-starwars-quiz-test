import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, empty } from 'rxjs';
import { expand, concatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StarWarsService {

  apiURL = 'https://swapi.co/api';

  constructor(
    private http: HttpClient
  ) { }

  getAll(type) {
    const getNext = (next?: number): Observable<any> => {
      return this.http.get(`${this.apiURL}/${type}/?page=${next}`);
    };

    return getNext(1).pipe(
      expand(data => {
        if (data.next !== null) {
          return getNext(data.next.match(/\d+$/)[0]);
        } else {
          return empty();
        }
      }),
      concatMap(data => data.results)
    );
  }

  getFromURL(url) {
    return this.http.get(`${url}`);
  }
}
