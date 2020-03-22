import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { combineLatest, Observable, ReplaySubject, Subject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { CountryWithLatestStats, sortCountryWithLatestStats } from './country-with-lateststats.model';
import { Covid19Service } from './covid19.service';
import { SortOptions } from './sort-bar/sort-bar.component';

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
  styles: [`
    app-country-stat {
      margin: 1em;
      width: 35em;
      display: inline-block;
    }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  private sortOptions$: Subject<SortOptions> = new ReplaySubject();
  private covid19Stats$: Observable<CountryWithLatestStats[]>;

  sortedCovid19Stats$: Observable<{
    sortOptions: SortOptions;
    stats: CountryWithLatestStats[];
  }>;

  constructor(private covid19Service: Covid19Service) {
  }

  ngOnInit(): void {
    this.covid19Stats$ = this.covid19Service.covid19Stats$.pipe(shareReplay(1));

    this.sortedCovid19Stats$ = combineLatest([this.covid19Stats$, this.sortOptions$])
      .pipe(
        map(([stats, sortOptions]) => {
          return {
            sortOptions,
            stats: stats.sort(sortCountryWithLatestStats(sortOptions.statContainer, sortOptions.statField))
          };
        }),
        shareReplay(1)
      );
  }

  updateSorting(sortOptions: SortOptions) {
    this.sortOptions$.next(sortOptions);
  }
}


