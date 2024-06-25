import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
<<<<<<< Updated upstream
  private olympics$ = new BehaviorSubject<any>(undefined);
=======
  private olympics$ = new BehaviorSubject<OlympicData[] | undefined>(undefined);
>>>>>>> Stashed changes

  constructor(private http: HttpClient) {}

  loadInitialData() {
<<<<<<< Updated upstream
    return this.http.get<any>(this.olympicUrl).pipe(
=======
    return this.http.get<OlympicData[]>(this.olympicUrl).pipe(
>>>>>>> Stashed changes
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return caught;
      })
    );
  }

<<<<<<< Updated upstream
  getOlympics() {
=======
  getOlympics(): Observable<OlympicData[] | undefined> {
>>>>>>> Stashed changes
    return this.olympics$.asObservable();
  }
}
