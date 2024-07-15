import { Component, OnInit, OnDestroy } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicData } from 'src/app/core/models/Olympic';
import { Chart } from 'chart.js/auto';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  olympicData: OlympicData[] | undefined;
  totalMedalsByCountry: { id: number; country: string; totalMedals: number }[] =
    [];
  chart: Chart<'pie', number[], string> | undefined;
  countryWithMaxParticipations:
    | { country: string; participations: number }
    | undefined;
  private countryId?: number;
  private elementIndex?: number;
  subscriptions: Subscription = new Subscription();

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    const getOlympicsSubscription = this.olympicService
      .getOlympics()
      .subscribe({
        next: (data) => {
          if (data) {
            this.olympicData = data;
            this.calculateTotalMedalsByCountry();
            this.findCountryWithMaxParticipations();
            this.pieChart();
          }
        },
        error: (err) => console.error('Error fetching Olympic data', err),
      });
    this.subscriptions.add(getOlympicsSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  calculateTotalMedalsByCountry(): void {
    this.totalMedalsByCountry =
      this.olympicData?.map((country) => {
        const totalMedals = country.participations.reduce(
          (sum, participation) => sum + participation.medalsCount,
          0
        );
        return { id: country.id, country: country.country, totalMedals };
      }) || [];
  }

  findCountryWithMaxParticipations(): void {
    // Permet de créer un objet qui stock un ensemble de SET, ce qui évite les doublons
    const participationsCount: { [country: string]: Set<number> } = {};

    // Ajoute le nombre de participations par pays
    this.olympicData?.forEach((country) => {
      participationsCount[country.country] = new Set<number>();
      country.participations.forEach((participation) => {
        participationsCount[country.country].add(participation.id);
      });
    });

    let maxParticipations = 0;
    let countryWithMaxParticipations = '';

    // Parcours chaque pays et son ensemble de participations
    for (const [country, participations] of Object.entries(
      participationsCount
    )) {
      if (participations.size > maxParticipations) {
        maxParticipations = participations.size;
        countryWithMaxParticipations = country;
      }
    }

    // Renvoie le pays avec le maximum de participations
    this.countryWithMaxParticipations = {
      country: countryWithMaxParticipations,
      participations: maxParticipations,
    };
  }

  pieChart(): void {
    try {
      const countryNames = this.totalMedalsByCountry.map(
        (country) => country.country
      );
      const medalsCount = this.totalMedalsByCountry.map(
        (country) => country.totalMedals
      );

      this.chart = new Chart('pieChart', {
        type: 'pie',
        data: {
          labels: countryNames,
          datasets: [
            {
              label: 'Nombre de médailles',
              data: medalsCount,
              borderWidth: 1,
            },
          ],
        },
        options: {
          onClick: (event, elements) => {
            try {
              if (elements.length > 0) {
                this.elementIndex = elements[0].index;
                this.countryId =
                  this.totalMedalsByCountry[this.elementIndex]?.id;
                if (this.countryId) {
                  this.router.navigate(['/details-country', this.countryId]);
                }
              }
            } catch (error) {
              console.error('Error navigating to country details', error);
            }
          },
        },
      });
    } catch (error) {
      console.error('Error initializing chart', error);
    }
  }
}
