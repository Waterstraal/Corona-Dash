import { Component } from '@angular/core';
import { Covid19DayStats, Covid19HttpService, Covid19Stats } from './covid19-http.service';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

export type SortOptions =
  'percentageDeaths'
  | 'percentageRecovered'
  | 'percentageConfirmed'
  | 'totalDeaths'
  | 'totalRecovered'
  | 'totalConfirmed' ;

@Component({
  selector: 'app-root',
  template: `
    <div>
      <mat-button-toggle-group [(value)]="sortBy">
        <mat-button-toggle value="percentageDeaths" aria-label="Sort by % Increase Deaths">% Increase 💀</mat-button-toggle>
        <mat-button-toggle value="percentageConfirmed" aria-label="Sort by % Increase Confirmed">% Increase 😷</mat-button-toggle>
        <mat-button-toggle value="percentageRecovered" aria-label="Sort by % Increase Recovered">% Increase 😃</mat-button-toggle>
        <mat-button-toggle value="totalDeaths" aria-label="Sort by Total Deaths">Total 💀</mat-button-toggle>
        <mat-button-toggle value="totalConfirmed" aria-label="Sort by Total Confirmed">Total 😷</mat-button-toggle>
        <mat-button-toggle value="totalRecovered" aria-label="Sort by Total Recovered">Total 😃</mat-button-toggle>
      </mat-button-toggle-group>
    </div>
    <ng-container *ngIf="sortedCovid19Stats$ | async as covid19Stats; else loading">
      <app-country-stat *ngFor="let countryStat of covid19Stats" [countryStat]="countryStat"></app-country-stat>
    </ng-container>
    <ng-template #loading>
      <mat-progress-bar mode="indeterminate"></mat-progress-bar>
    </ng-template>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private sortBy$: BehaviorSubject<SortOptions> = new BehaviorSubject<SortOptions>('percentageDeaths');

  get sortBy(): SortOptions {
    return this.sortBy$.getValue();
  }

  set sortBy(value: SortOptions) {
    this.sortBy$.next(value);
  }

  private covid19Stats$: Observable<CountryWithLatestStats[]> = this.covid19HttpService.get().pipe(
    map((val: Covid19Stats) => {
      const result: CountryWithLatestStats[] = [];
      for (const [key, value] of Object.entries(val)) {
        result.push(new CountryWithLatestStats(key, value[value.length - 1], value[value.length - 2]));
      }
      return result;
    }),
    shareReplay(1));

  sortedCovid19Stats$: Observable<CountryWithLatestStats[]> = combineLatest([this.covid19Stats$, this.sortBy$]).pipe(
    map(([val, sortBy]) => val.sort(sortFunctions[sortBy])),
    shareReplay(1)
  );

  constructor(private covid19HttpService: Covid19HttpService) {
  }
}

const sortFunctions: { [key in SortOptions]: (a: CountryWithLatestStats, b: CountryWithLatestStats) => number } = {
  percentageDeaths: (a: CountryWithLatestStats, b: CountryWithLatestStats) => b.percentageIncrease.deaths - a.percentageIncrease.deaths,
  percentageRecovered: (a: CountryWithLatestStats, b: CountryWithLatestStats) => b.percentageIncrease.recovered - a.percentageIncrease.recovered,
  percentageConfirmed: (a: CountryWithLatestStats, b: CountryWithLatestStats) => b.percentageIncrease.confirmed - a.percentageIncrease.confirmed,
  totalDeaths: (a: CountryWithLatestStats, b: CountryWithLatestStats) => b.latestStats.deaths - a.latestStats.deaths,
  totalRecovered: (a: CountryWithLatestStats, b: CountryWithLatestStats) => b.latestStats.recovered - a.latestStats.recovered,
  totalConfirmed: (a: CountryWithLatestStats, b: CountryWithLatestStats) => b.latestStats.confirmed - a.latestStats.confirmed,
};

export class CountryWithLatestStats {
  public percentageIncrease: Covid19DayStats;

  constructor(public country: string, public latestStats: Covid19DayStats, public oneDayBeforeLatestStats: Covid19DayStats) {
    this.percentageIncrease = {
      deaths: oneDayBeforeLatestStats.deaths <= 0 ? 0 : (latestStats.deaths - oneDayBeforeLatestStats.deaths) / oneDayBeforeLatestStats.deaths,
      recovered: oneDayBeforeLatestStats.deaths <= 0 ? 0 : (latestStats.recovered - oneDayBeforeLatestStats.recovered) / oneDayBeforeLatestStats.recovered,
      confirmed: oneDayBeforeLatestStats.deaths <= 0 ? 0 : (latestStats.confirmed - oneDayBeforeLatestStats.confirmed) / oneDayBeforeLatestStats.confirmed,
      date: latestStats.date
    };
  }
}
