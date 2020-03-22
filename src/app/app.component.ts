import { Component } from '@angular/core';
import { combineLatest, Observable, ReplaySubject, Subject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { CountryWithLatestStats, sortCountryWithLatestStats } from './country-with-lateststats.model';
import { Covid19Service } from './covid19.service';
import { SortOptions } from './sort-bar/sort-bar.component';

export interface SortedStats {
  sortOptions: SortOptions;
  stats: CountryWithLatestStats[];
}

@Component({
  selector: 'app-root',
  template: `
    <app-sort-bar (sortOptions)="updateSorting($event)"></app-sort-bar>
    <ng-container *ngIf="sortedCovid19Stats$ | async as covid19Stats; else loading">
      <app-country-stat *ngFor="let countryStat of covid19Stats.stats"
                        [countryStat]="countryStat"
                        [statContainer]="covid19Stats.sortOptions.statContainer"
                        [statField]="covid19Stats.sortOptions.statField"></app-country-stat>
    </ng-container>
    <ng-template #loading>
      <mat-progress-bar mode="indeterminate"></mat-progress-bar>
    </ng-template>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private sortOptions$: Subject<SortOptions> = new ReplaySubject();
  private covid19Stats$: Observable<CountryWithLatestStats[]> = this.covid19Service.covid19Stats$.pipe(shareReplay(1));

  sortedCovid19Stats$: Observable<SortedStats> = combineLatest([this.covid19Stats$, this.sortOptions$])
    .pipe(
      map(([stats, sortOptions]) => {
        return {
          sortOptions,
          stats: stats.sort(sortCountryWithLatestStats(sortOptions.statContainer, sortOptions.statField))
        };
      }),
      shareReplay(1)
    );

  constructor(private covid19Service: Covid19Service) {
  }

  updateSorting(sortOptions: SortOptions) {
    this.sortOptions$.next(sortOptions);
  }
}


