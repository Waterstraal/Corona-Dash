import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { combineLatest, Observable, ReplaySubject, Subject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { CountryWithLatestStats, sortCountryWithLatestStats } from './services/country-with-lateststats.model';
import { Covid19Service } from './services/covid19.service';
import { SortOptions } from './components/sort-bar.component';

@Component({
  selector: 'app-root',
  template: `
    <app-sort-bar (sortOptions)="updateSorting($event)"></app-sort-bar>
    <div class="container-fluid">
      <div class="row">
        <ng-container *ngIf="sortedCovid19Stats$ | async as covid19Stats; else loading">
          <app-country-stat class="col-xs-12 col-lg-6 col-xl-4"
                            *ngFor="let countryStat of covid19Stats.stats"
                            [countryStat]="countryStat"
                            [statContainer]="covid19Stats.sortOptions.statContainer"
                            [statField]="covid19Stats.sortOptions.statField"></app-country-stat>
        </ng-container>
      </div>
    </div>
    <ng-template #loading>
      <mat-progress-bar mode="indeterminate"></mat-progress-bar>
    </ng-template>
  `,
  styles: [`
    app-country-stat {
      display: block;
      padding-top: 15px;
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


