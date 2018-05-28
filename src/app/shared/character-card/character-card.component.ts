import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GoogleService } from '../../services/google.service';
import { IndexedDBService } from '../../services/indexed-db.service';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss']
})
export class CharacterCardComponent implements OnInit {

  @Input() charData: any;
  @Input() potentialPoints = 10;

  @Output() enterPressed = new EventEmitter();

  image = null;

  constructor(
    private google: GoogleService,
    private idb: IndexedDBService
  ) { }

  ngOnInit() {
    this.charData.guess = '';
    this.charData.points = this.potentialPoints;

    if (this.charData.images === undefined) {
      this.google.searchImageFor(this.charData.name).subscribe(images => {
        this.charData.images = images;
        this.idb.updateRecord('people', this.charData);
        this.chooseImage();
      });
    } else {
      this.chooseImage();
    }

    this.updateValue('planets');
    this.updateValue('films');
    this.updateValue('species');
    this.updateValue('vehicles');
    this.updateValue('starships');
  }

  chooseImage() {
    const images = this.charData.images;
    this.image = images[Math.floor(Math.random() * images.length)];
  }

  updateValue(type) {
    if (type === 'planets') {
      const url = this.charData.homeworld;
      if (url.indexOf('https://') === -1) { return; }
      this.idb.getRecord(type, url).then(
        planet => {
          this.charData.homeworld = planet.name;
        }
      );
    } else {
      this.charData[type].forEach((url, index) => {
        if (url.indexOf('https://') === -1) { return; }
        this.idb.getRecord(type, url).then(
          obj => {
            this.charData[type][index] = obj.name || obj.title;
          }
        );
      });
    }
  }

  toggleInfo(button, modal) {
    this.charData.points = this.potentialPoints / 2;
    button.classList.add('inactive');
    modal.classList.toggle('show');
  }

  onEnterPressed(value) {
    this.enterPressed.emit(value);
  }

}
