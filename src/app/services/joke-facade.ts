import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  exhaustMap,
  map,
  Observable,
  Subscription,
  tap,
  timer,
  withLatestFrom,
} from 'rxjs';
import { JokeService } from './joke-service';
import { JokeApiResponse, JokeViewModel } from './jokes.model';
import { JOKE_MAX_FAVOURITES, JOKE_REFRESH_RATE_SECONDS } from '../app.constants';

@Injectable({
  providedIn: 'root',
})
export class JokeFacade {
  #service = inject(JokeService);

  #subscription: Subscription | null = null;
  #jokeListState: BehaviorSubject<JokeViewModel[]> = new BehaviorSubject<JokeViewModel[]>([]);
  #favouriteListState: BehaviorSubject<JokeViewModel[]> = new BehaviorSubject<JokeViewModel[]>([]);
  #fetcher$: Observable<JokeViewModel[]> =
    // timer(0, 10000) starts immediately and fires every 10s
    timer(0, JOKE_REFRESH_RATE_SECONDS).pipe(
      // exhaustMap ensures we don't start a new request if the previous one is still pending
      exhaustMap(() => this.#service.getRandomJoke()),
      // add the fetched joke to the list of existing jokes
      withLatestFrom(this.#jokeListState),
      map(([newJoke, existingList]) => {
        return existingList.concat(this.#createViewModel(newJoke));
      }),
      // map to view model
      map(list => this.#mapToViewModel(list))
    );

  // to not expose the subjects themselves, we expose only the observables of them
  latestJokes$: Observable<JokeViewModel[]> = this.#jokeListState.asObservable();
  favourites$: Observable<JokeViewModel[]> = this.#favouriteListState.asObservable().pipe(
    tap(list => {
      console.log('favourites: ', list);
    })
  );

  startGettingRandomJokes(): void {
    this.#subscription?.unsubscribe();
    if (!this.#subscription || this.#subscription.closed) {
      this.#subscription = this.#fetcher$.subscribe(currentListOfJokes => {
        this.#jokeListState.next(currentListOfJokes);
      });
    }
  }

  stopGettingRandomJokes(): void {
    if (this.#subscription && !this.#subscription?.closed) {
      this.#subscription.unsubscribe();
    }
  }

  loadFavouritesFromLocalStorage(): void {
    const existingFavouriteJokes = localStorage.getItem('jokes');
    if (existingFavouriteJokes) {
      this.#favouriteListState.next(JSON.parse(existingFavouriteJokes));
    }
  }

  setFavourite(favouritedJoke: JokeViewModel, isFavourite: boolean): void {
    favouritedJoke.isFavourite = isFavourite;
    this.#updateJokeListWithFavourites(favouritedJoke);
    this.#updateFavouriteListWith(favouritedJoke);
  }

  getNumFavourites(): number {
    return this.#favouriteListState
      .getValue()
      .reduce((numFavourites, joke) => numFavourites + (joke.isFavourite ? 1 : 0), 0);
  }

  #createViewModel(joke: JokeApiResponse): JokeViewModel {
    return {
      ...joke,
      isFavourite: false,
      visibleInStream: true,
    };
  }

  #mapToViewModel(list: JokeViewModel[]): JokeViewModel[] {
    return list.map((joke, index, allJokes) => ({
      ...joke,
      visibleInStream: index >= allJokes.length - JOKE_MAX_FAVOURITES,
    }));
  }

  #updateJokeListWithFavourites(updatedJoke: JokeViewModel): void {
    const updatedJokeList = this.#jokeListState.getValue().map(joke => {
      if (joke.value === updatedJoke.value) {
        return { ...joke, isFavourite: updatedJoke.isFavourite };
      }
      return joke;
    });

    this.#jokeListState.next(updatedJokeList);
  }

  #updateFavouriteListWith(jokeToUpdate: JokeViewModel): void {
    let updatedJokeList: JokeViewModel[] = [];
    if (jokeToUpdate.isFavourite) {
      updatedJokeList = this.#favouriteListState.getValue().concat([jokeToUpdate]);
    } else {
      updatedJokeList = this.#favouriteListState
        .getValue()
        .filter(joke => joke.id !== jokeToUpdate.id);
    }
    this.#favouriteListState.next(updatedJokeList);
    localStorage.setItem('jokes', JSON.stringify(updatedJokeList));
  }
}
