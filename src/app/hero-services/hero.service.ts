import { Injectable } from '@angular/core';
import { Hero } from '../hero';
import { Observable, of } from 'rxjs'; 
import { MessageService } from '../message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'http://localhost:8080'; 
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private messageService: MessageService, private client: HttpClient) { }

  /** GET heroes from the server */
  getHeroes(): Observable<Hero[]> {
    const url = this.heroesUrl + "/heroes"
    return this.client.get<Hero[]>(url)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', [])),
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<Hero> {
    const subUrl = this.heroesUrl + "/heroes"
    const url = `${subUrl}/${id}`;
    return this.client.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {
    const url = this.heroesUrl + "/heroes"
    return this.client.put(url, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addHero(hero: Hero): Observable<any>{
    const url = this.heroesUrl + "/heroes"
    return this.client.post<Hero>(url, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`Added new hero ${newHero.name}!`)), 
      catchError(this.handleError<Hero>('Hero service: Add hero'))
    );
  }

  deleteHero(id: number): Observable<any> {
    const subUrl = this.heroesUrl + "/heroes"
    const url = `${subUrl}/${id}`;
    return this.client.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log("Hero deleted!")),
      catchError(this.handleError<Hero>('Hero service: Delete hero'))
    );
  }

    /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    const url = this.heroesUrl + "/heroes" 
    return this.client.get<Hero[]>(`${url}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }


  private log(message: string){
    this.messageService.addMessage(`Hero service: ${message}`);
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 *
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
}
