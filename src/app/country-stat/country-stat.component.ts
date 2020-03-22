import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CountryWithLatestStats } from '../country-with-lateststats.model';

@Component({
  selector: 'app-country-stat',
  template: `
    <mat-card [class.death]="countryStat.latestStats.deaths > 0">
      <mat-card-title>{{ countryStat.country }}</mat-card-title>
      <h1>{{ statContainer === 'latestStats' ? countryStat[statContainer][statField] : countryStat[statContainer][statField] | percent }}</h1>
    </mat-card>`,
  styles: [`
    mat-card {
      border-left: 5px solid green;
    }

    mat-card.death {
      border-left-color: red;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryStatComponent {
  @Input() countryStat: CountryWithLatestStats;
  @Input() statContainer: 'percentageIncrease' | 'latestStats';
  @Input() statField: 'deaths' | 'recovered' | 'confirmed';
}
