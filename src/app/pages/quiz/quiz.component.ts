import { Component, OnInit, ViewChild } from '@angular/core';
import { IndexedDBService } from '../../services/indexed-db.service';
import { DragScrollDirective } from 'ngx-drag-scroll';
import { interval } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  waitingCharacters = [];
  characters = [];
  arrows = Array(3);

  @ViewChild('nav', { read: DragScrollDirective }) ds: DragScrollDirective;

  constructor(
    private idb: IndexedDBService,
    private router: Router
  ) { }

  ngOnInit() {
    localStorage.removeItem('guessedCharacters');

    this.idb.getAllRecords('people').then(data => {
      this.shuffle(data);
      this.waitingCharacters = data;
      this.loadMore(3);

      const delayedLoading = interval(2000).subscribe(() => {
        this.loadMore(1);
        if (this.waitingCharacters.length === 0) {
          delayedLoading.unsubscribe();
        }
      });
    });
  }

  moveLeft() {
    this.ds.moveLeft();
  }

  moveRight() {
    this.ds.moveRight();
  }

  loadMore(count = 1) {
    if (this.waitingCharacters.length > 0) {
      const toLoad = this.waitingCharacters.splice(0, count);

      toLoad.forEach(people => {
        this.characters.push(people);
      });
    }
  }

  finish() {
    this.waitingCharacters = [];
    const guessedCharacters = this.characters.filter(data => {
      return data.guess !== '';
    });

    localStorage.setItem('guessedCharacters', JSON.stringify(guessedCharacters));

    this.router.navigate(['finished']);
  }

  /**
  * Shuffles array in place. ES6 version
  * @param {Array} a items An array containing the items.
  */
  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

}
