import { Component, OnInit } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicData } from 'src/app/core/models/Olympic';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  olympicData: OlympicData[] | undefined;

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympicService.loadInitialData().subscribe();
    this.olympicService.getOlympics().subscribe((data) => {
      this.olympicData = data;
    });
  }
}
