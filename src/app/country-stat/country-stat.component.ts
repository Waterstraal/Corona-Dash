import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CountryWithLatestStats } from '../app.component';

@Component({
  selector: 'app-country-stat',
  template: `
    <mat-card [class.death]="countryStat.latestStats.deaths > 0">
      <mat-card-title>{{ countryStat.country }}</mat-card-title>
      <h1>
        {{ countryStat.percentageIncrease.deaths | percent }}
      </h1>
      <p>💀 {{countryStat.latestStats.date | date }}: {{countryStat.latestStats.deaths}}</p>
      <p>💀 {{countryStat.oneDayBeforeLatestStats.date | date }}: {{countryStat.oneDayBeforeLatestStats.deaths}}</p>
    </mat-card>`,
  styleUrls: ['./country-stat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryStatComponent {
  @Input() countryStat: CountryWithLatestStats;
}
