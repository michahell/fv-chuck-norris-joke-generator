import { inject, Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { JokeApiResponse } from './jokes.model';

export const API_BASE_URL = 'https://api.chucknorris.io';

@Injectable({
  providedIn: 'root',
})
export class JokeService {
  #http = inject(HttpClient);
  #corsProxiedBaseUrl = this.#getCorsProxiedBaseUrl();

  /**
   * Get a random joke from the Chuck Norris Joke API
   *
   */
  getRandomJoke(): Observable<JokeApiResponse> {
    return this.#http.get<JokeApiResponse>(`${this.#corsProxiedBaseUrl}/jokes/random`).pipe(
      map((response: JokeApiResponse) => response),
      catchError(error => {
        console.error('Error fetching joke:', error);
        throw new Error('Failed to fetch joke. Please try again.');
      })
    );
  }

  #getCorsProxiedBaseUrl(): string {
    if (isDevMode()) {
      return API_BASE_URL;
    }
    return `https://corsproxy.io/?url=${API_BASE_URL}`;
  }
}
