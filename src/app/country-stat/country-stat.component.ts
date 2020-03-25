import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CountryWithLatestStats } from '../country-with-lateststats.model';

@Component({
  selector: 'app-country-stat',
  template: `
    <mat-card [class.death]="countryStat.latestStats.deaths > 0">
      <mat-card-title>{{ countryStat.country }}</mat-card-title>
      <h2>
        <span [class.selected]="statField === 'deaths' && statContainer === 'latestStats'">
          <app-single-stat [countryStat]="countryStat" statContainer="latestStats" statField="deaths"></app-single-stat>
        </span>
        <span [class.selected]="statField === 'confirmed' && statContainer === 'latestStats'">
          <app-single-stat [countryStat]="countryStat" statContainer="latestStats" statField="confirmed"></app-single-stat>
        </span>
        <span [class.selected]="statField === 'recovered' && statContainer === 'latestStats'">
          <app-single-stat [countryStat]="countryStat" statContainer="latestStats" statField="recovered"></app-single-stat>
        </span>
      </h2>
      <h2>
        <span [class.selected]="statField === 'deaths' && statContainer === 'percentageIncrease'">
          <app-single-stat [countryStat]="countryStat" statContainer="percentageIncrease" statField="deaths"></app-single-stat>
        </span>
        <span [class.selected]="statField === 'confirmed' && statContainer === 'percentageIncrease'">
          <app-single-stat [countryStat]="countryStat" statContainer="percentageIncrease" statField="confirmed"></app-single-stat>
        </span>
        <span [class.selected]="statField === 'recovered' && statContainer === 'percentageIncrease'">
        <app-single-stat [countryStat]="countryStat" statContainer="percentageIncrease" statField="recovered"></app-single-stat>
        </span>
      </h2>
    </mat-card>`,
  styles: [`
    mat-card {
      border-left: 5px solid green;
    }

    mat-card.death {
      border-left-color: red;
    }

    h2 {
      display: flex;
    }

    h2 span {
      flex: 1;
      filter: grayscale(100%);
    }

    h2 span.selected {
      filter: none;
      font-size: 1.3em;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryStatComponent {
  @Input() countryStat: CountryWithLatestStats;
  @Input() statContainer: 'percentageIncrease' | 'latestStats';
  @Input() statField: 'deaths' | 'recovered' | 'confirmed';
}
