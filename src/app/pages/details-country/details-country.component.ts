import { Component } from '@angular/core';
import { OlympicData } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details-country',
  templateUrl: './details-country.component.html',
  styleUrl: './details-country.component.scss',
})
export class DetailsCountryComponent {
  countryData: OlympicData | undefined;

  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.olympicService.getCountryById(id).subscribe((data) => {
      this.countryData = data;
    });
  }
}
