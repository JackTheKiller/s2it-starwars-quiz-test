import { Component, OnInit, HostBinding } from '@angular/core';
import { StarWarsService } from '../../services/star-wars.service';
import { IndexedDBService } from '../../services/indexed-db.service';

@Component({
  selector: 'app-db-loader',
  templateUrl: './db-loader.component.html',
  styleUrls: ['./db-loader.component.scss']
})
export class DbLoaderComponent implements OnInit {

  @HostBinding('class.show') isLoading = false;

  constructor(
    private sws: StarWarsService,
    private idb: IndexedDBService
  ) { }

  ngOnInit() {
    if (!localStorage.getItem('loaded')) {
      this.isLoading = true;
      console.log('loading started');
      this.buildDataBase().then(
        () => {
          this.isLoading = false;
          localStorage.setItem('loaded', '1');
          console.log('loading finished');
        },
        error => console.log('loading error:', error)
      );
    }
  }

  buildDataBase() {
    return Promise.all([
      this.loadData('people'),
      this.loadData('planets'),
      this.loadData('films'),
      this.loadData('species'),
      this.loadData('vehicles'),
      this.loadData('starships')
    ]);
  }

  loadData(type) {
    return new Promise((resolve, reject) => {
      this.sws.getAll(type).subscribe(
        (data: any) => {
          this.idb.getRecord(type, data.url).then(record => {
            if (record === undefined) {
              this.idb.saveRecord(type, data);
            }
          });
        },
        err => reject(err),
        () => {
          resolve();
        }
      );
    });
  }

}
