import { Component } from '@angular/core';
import { Covid19HttpService, Covid19Stats } from './covid19-http.service';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <ol>
      <li *ngFor="let countryStat of covid19Stats$ | async | keyvalue">
        {{ countryStat.key }}
      </li>
    </ol>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  covid19Stats$: Observable<Covid19Stats> = this.covid19HttpService.get().pipe(shareReplay(1));

  constructor(private covid19HttpService: Covid19HttpService) {
  }
}
