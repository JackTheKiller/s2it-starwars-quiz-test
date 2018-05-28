import { Component, OnInit, ViewChild } from '@angular/core';
import { IndexedDBService } from '../../services/indexed-db.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('scoresLink') scoresLink;

  constructor(
    private idb: IndexedDBService
  ) { }

  ngOnInit() {
    this.idb.getOrderedScores().then((data: any[]) => {
      if (data.length > 0) {
        this.scoresLink.nativeElement.classList.remove('hidden');
      }
    });
  }

}
