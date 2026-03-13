import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { JokeFacade } from '../../services/joke-facade';
import { JokeViewModel } from '../../services/jokes.model';
import { Joke } from '../../components/joke/joke';

@Component({
  selector: 'app-favourites',
  imports: [Joke],
  templateUrl: './favourites.html',
})
export default class Favourites implements OnInit {
  #jokeFacade = inject(JokeFacade);
  favouriteJokes = toSignal(this.#jokeFacade.favourites$);

  ngOnInit(): void {
    this.#jokeFacade.stopGettingRandomJokes();
    this.#jokeFacade.loadFavouritesFromLocalStorage();
  }

  onRemoveFavourite(joke: JokeViewModel): void {
    this.#jokeFacade.setFavourite(joke, false);
  }
}
