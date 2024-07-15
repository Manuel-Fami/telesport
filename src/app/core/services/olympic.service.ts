import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { OlympicData } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<OlympicData[]>(this.olympicUrl).pipe(
      catchError((error, caught) => {
        console.error(error);
        // Tableau vide
        return of([]);
      })
    );
  }

  //Tableau d'objets
  getOlympics(): Observable<OlympicData[] | undefined> {
    return this.loadInitialData();
  }

  //Objet seul
  getCountryById(id: number): Observable<OlympicData | undefined> {
    return this.getOlympics().pipe(
      map((olympicData: OlympicData[] | undefined) =>
        olympicData?.find((country) => country.id === id)
      )
    );
  }
}
