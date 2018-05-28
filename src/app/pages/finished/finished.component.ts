import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IndexedDBService } from '../../services/indexed-db.service';

@Component({
  selector: 'app-finished',
  templateUrl: './finished.component.html',
  styleUrls: ['./finished.component.scss']
})
export class FinishedComponent implements OnInit {

  points = 0;
  result = [];

  constructor(
    private router: Router,
    private idb: IndexedDBService
  ) { }

  ngOnInit() {
    const guessedCharacters = JSON.parse(localStorage.getItem('guessedCharacters'));

    if (guessedCharacters === undefined) {
      this.router.navigate(['']);
    }

    guessedCharacters.forEach(people => {
      const name = people.name.trim().toLowerCase();
      const guess = people.guess.trim().toLowerCase();
      let success = false;

      if (name === guess) {
        this.points += people.points;
        success = true;
      }

      this.result.push({
        success,
        name: people.name,
        guess: people.guess
      });
    });
  }

  save(name, email) {
    let valid = true;

    if (name.value.trim().length < 2 && name.value.trim().length > 16) {
      name.classList.add('invalid');
      valid = false;
    } else {
      name.classList.remove('invalid');
    }

    if (!this.isEmailValid(email.value)) {
      email.classList.add('invalid');
      valid = false;
    } else {
      email.classList.remove('invalid');
    }

    if (!valid) { return; }

    this.idb.saveScore({
      name: name.value.trim(),
      email: email.value.trim(),
      score: this.points,
      correctGuesses: this.result.filter(data => data.success).length
    }).then(() => {
      localStorage.removeItem('guessedCharacters');
      this.router.navigate(['scores']);
    });
  }

  isEmailValid(email) {
    // tslint:disable-next-line:max-line-length
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

}
