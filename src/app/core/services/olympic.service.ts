import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { OlympicData } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<OlympicData[] | undefined>(undefined);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<OlympicData[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(undefined);
        return caught;
      })
    );
  }

  getOlympics(): Observable<OlympicData[] | undefined> {
    return this.olympics$.asObservable();
  }

  getCountryById(id: number): Observable<OlympicData | undefined> {
    return this.getOlympics().pipe(
      map((olympicData: OlympicData[] | undefined) =>
        olympicData?.find((country) => country.id === id)
      )
    );
  }
}
