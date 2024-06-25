import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
<<<<<<< Updated upstream
  public olympics$: Observable<any> = of(null);
=======
  olympicData: OlympicData[] | undefined;
>>>>>>> Stashed changes

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
<<<<<<< Updated upstream
    this.olympics$ = this.olympicService.getOlympics();
=======
    this.olympicService.loadInitialData().subscribe();
    this.olympicService.getOlympics().subscribe((data) => {
      this.olympicData = data;
    });
>>>>>>> Stashed changes
  }
}
