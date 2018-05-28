import { Injectable } from '@angular/core';
import { AngularIndexedDB } from 'angular2-indexeddb';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService extends AngularIndexedDB {

  currentVersion;

  constructor() {
    super('StarWarsQuiz', 4);

    this.currentVersion = this.dbWrapper.dbVersion;

    this.openDatabase(this.currentVersion, (evt) => {
      evt.currentTarget.result.createObjectStore('people', { keyPath: 'url' });
      evt.currentTarget.result.createObjectStore('planets', { keyPath: 'url' });
      evt.currentTarget.result.createObjectStore('films', { keyPath: 'url' });
      evt.currentTarget.result.createObjectStore('species', { keyPath: 'url' });
      evt.currentTarget.result.createObjectStore('vehicles', { keyPath: 'url' });
      evt.currentTarget.result.createObjectStore('starships', { keyPath: 'url' });
      evt.currentTarget.result.createObjectStore('scores', { keyPath: 'id', autoIncrement: true });
    });
  }

  async saveRecord(store, record) {
    await this.openDatabase(this.currentVersion);
    return this.add(store, record).catch(
      event => {
        // ignoring error
        // most likely "Key already exists in the object store"
        console.log('error saving: ', event);
      });
  }

  async updateRecord(store, record) {
    await this.openDatabase(this.currentVersion);
    return this.update(store, record).catch(
      event => {
        // ignoring error
        // most likely "Key already exists in the object store"
        console.log('error updating: ', event);
      });
  }

  async getRecord(store, url) {
    await this.openDatabase(this.currentVersion);
    return this.getByKey(store, url).catch(
      event => {
        // logging errors
        console.log('error getting: ', event);
      });
  }

  async getCurrentCharactersCount() {
    await this.openDatabase(this.currentVersion);
    return new Promise((resolve, reject) => {
      this.getAll('people').then(
        data => resolve(data.length),
        error => reject(error)
      );
    });
  }

  async getAllRecords(store) {
    await this.openDatabase(this.currentVersion);
    return super.getAll(store);
  }

  async getOrderedScores() {
    await this.openDatabase(this.currentVersion);
    return new Promise((resolve, reject) => {
      this.getAll('scores').then(
        data => {
          const scores = data.sort((a: any, b: any) => {
            if (a.score < b.score) {
              return 1;
            }
            if (a.score > b.score) {
              return -1;
            }
            return 0;
          });
          resolve(scores);
        },
        error => reject(error)
      );
    });
  }

  async saveScore(data) {
    return this.saveRecord('scores', data);
  }

}
