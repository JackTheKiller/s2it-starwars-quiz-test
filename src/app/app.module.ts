import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { DragScrollModule } from 'ngx-drag-scroll';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { DbLoaderComponent } from './shared/db-loader/db-loader.component';
import { RulesComponent } from './pages/rules/rules.component';
import { StarWarsService } from './services/star-wars.service';
import { IndexedDBService } from './services/indexed-db.service';
import { ScoresComponent } from './pages/scores/scores.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { CharacterCardComponent } from './shared/character-card/character-card.component';
import { TimerComponent } from './shared/timer/timer.component';
import { FinishedComponent } from './pages/finished/finished.component';
import { LoadGuard } from './guards/load.guard';

const appRoutes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'quiz', component: QuizComponent, canActivate: [LoadGuard] },
  { path: 'finished', component: FinishedComponent },
  { path: 'scores', component: ScoresComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    DbLoaderComponent,
    RulesComponent,
    ScoresComponent,
    QuizComponent,
    CharacterCardComponent,
    TimerComponent,
    FinishedComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    HttpClientModule,
    DragScrollModule,
    FormsModule
  ],
  providers: [StarWarsService, IndexedDBService],
  bootstrap: [AppComponent]
})
export class AppModule { }
