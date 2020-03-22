import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CountryWithLatestStats } from '../country-with-lateststats.model';
import { FIELD_EMOJIS } from '../sort-bar/sort-bar.component';

@Component({
  selector: 'app-single-stat',
  template: `
    {{fieldEmojis[statField]}} {{ statContainer === 'latestStats' ?
      countryStat[statContainer][statField] :
      countryStat[statContainer][statField] | percent }}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleStatComponent {
  @Input() countryStat: CountryWithLatestStats;
  @Input() statContainer: 'percentageIncrease' | 'latestStats';
  @Input() statField: 'deaths' | 'recovered' | 'confirmed';

  readonly fieldEmojis: typeof FIELD_EMOJIS = FIELD_EMOJIS;
}
