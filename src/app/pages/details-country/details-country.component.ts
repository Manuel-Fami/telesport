import { Component, OnDestroy, OnInit } from '@angular/core';
import { OlympicData } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { Subscription } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-details-country',
  templateUrl: './details-country.component.html',
  styleUrl: './details-country.component.scss',
})
export class DetailsCountryComponent implements OnInit {
  countryData: OlympicData | undefined;
  chart: Chart | undefined;
  totalParticipations: number = 0;
  totalMedals: number = 0;
  totalAthletes: number = 0;
  private subscription: Subscription = new Subscription();
  private olympics$ = new BehaviorSubject<OlympicData[] | undefined>(undefined);

  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService
  ) {}

  // ngOnInit(): void {
  //   const id = Number(this.route.snapshot.paramMap.get('id'));
  //   this.olympicService.getCountryById(id).subscribe((data) => {
  //     this.countryData = data;
  //   });
  // }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.subscription.add(
      this.olympicService.getCountryById(id).subscribe((data) => {
        this.countryData = data;
      })
    );
    this.calculateTotals();
    this.createLineChart();
  }

  // ngOnDestroy(): void {
  //   this.subscription.unsubscribe();
  //   if (this.chart) {
  //     this.chart.destroy();
  //   }
  // }

  calculateTotals(): void {
    if (!this.countryData) return;

    this.totalParticipations = this.countryData.participations.length;
    this.totalMedals = this.countryData.participations.reduce(
      (sum, participation) => sum + participation.medalsCount,
      0
    );
    this.totalAthletes = this.countryData.participations.reduce(
      (sum, participation) => sum + participation.athleteCount,
      0
    );
  }

  createLineChart(): void {
    if (!this.countryData) return;

    const labels = this.countryData.participations.map(
      (participation) => `${participation.year} (${participation.city})`
    );

    const medals = this.countryData.participations.map(
      (participation) => participation.medalsCount
    );
    const athletes = this.countryData.participations.map(
      (participation) => participation.athleteCount
    );

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('lineChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Nombre de médailles',
            data: medals,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
          },
          {
            label: "Nombre d'athlètes",
            data: athletes,
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,

        scales: {
          x: {
            title: {
              display: false,
            },
          },
          y: {
            title: {
              display: false,
            },
            beginAtZero: true,
          },
        },
      },
    });
  }
}
