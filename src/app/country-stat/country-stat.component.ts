import { Component, Input } from '@angular/core';
import { CountryWithLatestStats } from '../app.component';

@Component({
  selector: 'app-country-stat',
  template: `
    <mat-card [class.death]="countryStat.latestStats.deaths > 0">
      <mat-card-title>{{ countryStat.country }}</mat-card-title>
      <h1>
        {{ countryStat.percentageIncrease.deaths | percent }}
      </h1>
      <h3>💀 today: {{countryStat.latestStats.deaths}}</h3>
      <h3>💀 yesterday: {{countryStat.oneDayBeforeLatestStats.deaths}}</h3>
    </mat-card>`,
  styleUrls: ['./country-stat.component.scss']
})
export class CountryStatComponent {
  @Input() countryStat: CountryWithLatestStats;
}
