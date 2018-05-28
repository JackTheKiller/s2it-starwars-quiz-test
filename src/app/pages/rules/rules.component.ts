import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IndexedDBService } from '../../services/indexed-db.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  totalCharacters: number;

  @ViewChild('themeMusic') themeMusic;

  constructor(
    private router: Router,
    private idb: IndexedDBService
  ) { }

  ngOnInit() {
    this.idb.getCurrentCharactersCount().then(data => this.totalCharacters = +data);
    this.themeMusic.nativeElement.addEventListener('ended', () => this.startQuiz());
  }

  startQuiz() {
    this.router.navigate(['quiz']);
  }

}
