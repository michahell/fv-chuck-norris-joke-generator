import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, exhaustMap, map, Observable, Subscription, tap, timer, withLatestFrom} from 'rxjs';
import {JokeService} from './joke-service';
import {JokeApiResponse, JokeViewModel} from './jokes.model';

export const JOKE_REFRESH_RATE_SECONDS = 2000;
export const JOKE_LIST_SIZE = 4;

@Injectable({
  providedIn: 'root',
})
export class JokeFacade {
  #service = inject(JokeService);

  #subscription: Subscription | null = null;
  #jokeListState: BehaviorSubject<JokeViewModel[]> = new BehaviorSubject<JokeViewModel[]>([]);
  #fetcher$: Observable<JokeViewModel[]> =
    // timer(0, 10000) starts immediately and fires every 10s
    timer(0, JOKE_REFRESH_RATE_SECONDS).pipe(
      // exhaustMap ensures we don't start a new request if the previous one is still pending
      exhaustMap(() => this.#service.getRandomJoke()),
      // add the fetched cocktail to the list of existing cocktails
      withLatestFrom(this.#jokeListState),
      map(([newCocktail, existingList]) => {
        return existingList.concat(this.#createViewModel(newCocktail));
      }),
      // map to view model
      map((list) => this.#mapToViewModel(list)),
    );

  // to not expose the subject itself, we expose only the observable of it
  latestJokes$: Observable<JokeViewModel[]> = this.#jokeListState.asObservable().pipe(
    tap((list) => {console.log(list)}),
  );

  startGettingRandomJokes(): void {
    console.log('start getting random jokes');
    this.#subscription?.unsubscribe();
    if (!this.#subscription || this.#subscription.closed) {
      this.#subscription = this.#fetcher$.subscribe((currentListOfJokes) => {
        this.#jokeListState.next(currentListOfJokes);
      });
    }
  }

  stopGettingRandomJokes(): void {
    console.log('stop getting random jokes');
    if (this.#subscription && !this.#subscription?.closed) {
      this.#subscription.unsubscribe();
    }
  }

  #createViewModel(joke: JokeApiResponse): JokeViewModel {
    return {
      ...joke,
      isFavourite: false,
      visibleInStream: true
    }
  }

  #mapToViewModel(list: JokeViewModel[]): JokeViewModel[] {
    return list.map((joke, index, allJokes) => ({
      ...joke,
      visibleInStream: index >= (allJokes.length - JOKE_LIST_SIZE)
    }));
  }
}
