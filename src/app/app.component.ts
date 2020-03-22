import { Component } from '@angular/core';
import { Covid19DayStats, Covid19HttpService, Covid19Stats } from './covid19-http.service';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <ng-container *ngIf="covid19Stats$ | async as covid19Stats">
      <app-country-stat *ngFor="let countryStat of covid19Stats" [countryStat]="countryStat"></app-country-stat>
    </ng-container>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  covid19Stats$: Observable<CountryWithLatestStats[]> = this.covid19HttpService.get().pipe(
    map((val: Covid19Stats) => {
      const result: CountryWithLatestStats[] = [];
      for (const [key, value] of Object.entries(val)) {
        result.push(new CountryWithLatestStats(key, value[value.length - 1], value[value.length - 2]));
      }
      return result.sort((a, b) => b.latestStats.deaths - a.latestStats.deaths);
    }),
    shareReplay(1));

  constructor(private covid19HttpService: Covid19HttpService) {
  }
}

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
