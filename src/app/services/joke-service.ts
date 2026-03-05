import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {JokeApiResponse} from './jokes.model';

export const API_BASE_URL = 'https://api.chucknorris.io';

@Injectable({
  providedIn: 'root',
})
export class JokeService {
  #http = inject(HttpClient);

  /**
   * Get a random cocktail from the Chuck Norris Joke API
   *
   */
  getRandomJoke(): Observable<JokeApiResponse> {
    return this.#http.get<JokeApiResponse>(`${API_BASE_URL}/jokes/random`).pipe(
      map((response: JokeApiResponse) => response),
      catchError((error) => {
        // console.error('Error fetching cocktail:', error);
        throw new Error('Failed to fetch cocktail. Please try again.');
      })
    );
  }
}
