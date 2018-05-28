import { Component, OnInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  @Input() hours = 0;
  @Input() minutes = 0;
  @Input() seconds = 0;

  @Output() timesUp = new EventEmitter();

  @HostBinding('class.danger') isCloseToFinish = false;

  initialInterval: number;
  futureDate: Date;
  timeLeft: string;

  constructor() { }

  ngOnInit() {

    this.futureDate = new Date();
    this.futureDate.setSeconds(this.futureDate.getSeconds() + (
      (this.hours * 60 * 60) + (this.minutes * 60) + this.seconds
    ));

    this.initialInterval = Math.floor((this.futureDate.getTime() - new Date().getTime()) / 1000);

    const subscription = interval(100).pipe(
      map((i) => Math.floor((this.futureDate.getTime() - new Date().getTime()) / 1000))
    ).subscribe(time => {
      this.timeLeft = this.getReadableTime(time);
      this.isCloseToFinish = time <= this.initialInterval * 0.15;
      if (time <= 0) {
        this.timesUp.emit();
        subscription.unsubscribe();
      }
    });
  }

  getReadableTime(t) {
    let hours, minutes, seconds;

    t = t <= 0 ? 0 : t;

    hours = Math.floor(t / 3600);
    t -= hours * 3600;

    minutes = Math.floor(t / 60) % 60;
    t -= minutes * 60;

    seconds = t % 60;

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return hours > 0 ? hours + ':' + minutes + ':' + seconds : minutes + ':' + seconds;
  }

}
