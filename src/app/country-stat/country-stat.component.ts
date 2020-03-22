import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CountryWithLatestStats } from '../country-with-lateststats.model';

@Component({
  selector: 'app-country-stat',
  template: `
    <mat-card [class.death]="countryStat.latestStats.deaths > 0">
      <mat-card-title>{{ countryStat.country }}</mat-card-title>
      <h1 *ngIf="statContainer === 'latestStats'">{{ countryStat.latestStats[statField] }}</h1>
      <h1 *ngIf="statContainer === 'percentageIncrease'">{{ countryStat.percentageIncrease[statField] | percent }}</h1>
      <!--      <p>💀 {{countryStat.latestStats.date | date }}: {{countryStat.latestStats.deaths}}</p>-->
      <!--      <p>💀 {{countryStat.oneDayBeforeLatestStats.date | date }}: {{countryStat.oneDayBeforeLatestStats.deaths}}</p>-->
    </mat-card>`,
  styleUrls: ['./country-stat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryStatComponent {
  @Input() countryStat: CountryWithLatestStats;
  @Input() statContainer: 'percentageIncrease' | 'latestStats';
  @Input() statField: 'deaths' | 'recovered' | 'confirmed';
}
