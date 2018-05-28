import { Component, OnInit } from '@angular/core';
import { IndexedDBService } from '../../services/indexed-db.service';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.scss']
})
export class ScoresComponent implements OnInit {

  result = [];

  constructor(
    private idb: IndexedDBService
  ) { }

  ngOnInit() {
    this.idb.getOrderedScores().then((data: any[]) => {
      this.result = data.slice(0, 10);
    });
  }

}
