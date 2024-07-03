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
  totalParticipations: number = 0;
  countryWithMaxParticipations:
    | { country: string; participations: number }
    | undefined;

  private subscriptions: Subscription = new Subscription();

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympicService.loadInitialData().subscribe();
    this.olympicService.getOlympics().subscribe((data) => {
      if (data) {
        this.olympicData = data;
        this.calculateTotalMedalsByCountry();
        this.findCountryWithMaxParticipations();

        // this.calculateTotalParticipations();
        this.chartPie();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    // Détruire le graphique existant, s'il existe
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined; // Assurez-vous que la référence à l'ancien graphique est supprimée
    }
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

  // Création du graphique Pie
  chartPie(): void {
    const countryNames = this.totalMedalsByCountry.map(
      (country) => country.country
    );
    const medalsCount = this.totalMedalsByCountry.map(
      (country) => country.totalMedals
    );
    // Détruire le graphique existant, s'il existe
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined; // Assurez-vous que la référence à l'ancien graphique est supprimée
    }

    this.chart = new Chart('pieChart', {
      type: 'pie',
      data: {
        // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        labels: countryNames,
        datasets: [
          {
            label: 'Nombre de médailles',
            data: medalsCount,
            // data: [12, 19, 13, 15, 12, 13],
            borderWidth: 1,
          },
        ],
      },
      options: {
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const elementIndex = elements[0].index;
            const countryId = this.totalMedalsByCountry[elementIndex].id;
            this.router.navigate(['/details-country', countryId]);
          }
        },
      },
    });
  }

  findCountryWithMaxParticipations(): void {
    const participationsCount: { [country: string]: Set<number> } = {};

    this.olympicData?.forEach((country) => {
      participationsCount[country.country] = new Set<number>();
      country.participations.forEach((participation) => {
        participationsCount[country.country].add(participation.id);
      });
    });

    let maxParticipations = 0;
    let countryWithMaxParticipations = '';

    for (const [country, participations] of Object.entries(
      participationsCount
    )) {
      if (participations.size > maxParticipations) {
        maxParticipations = participations.size;
        countryWithMaxParticipations = country;
      }
    }

    this.countryWithMaxParticipations = {
      country: countryWithMaxParticipations,
      participations: maxParticipations,
    };
  }

  // calculateTotalParticipations(): void {
  //   this.totalParticipations =
  //     this.olympicData?.reduce((country) => {
  //       // console.log(total);
  //       // console.log(country.participations.length);
  //       return country.participations.length;
  //       // return total + country.participations.length;
  //     }, 0) || 0;
  // }
}
