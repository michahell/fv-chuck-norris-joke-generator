import {Component, inject, OnInit, signal} from '@angular/core';
import {JokeFacade} from '../../services/joke-facade';
import {toSignal} from '@angular/core/rxjs-interop';
import {Joke} from '../../components/joke/joke';
import {JokeViewModel} from '../../services/jokes.model';

@Component({
  selector: 'app-jokes',
  imports: [Joke],
  templateUrl: './jokes.html',
})
export default class Jokes implements OnInit {
  #facade = inject(JokeFacade);
  latestJokes = toSignal(this.#facade.latestJokes$);
  fetchingJokes = signal<boolean>(false);

  ngOnInit(): void {
    this.startGettingRandomJokes();
  }

  startGettingRandomJokes(): void {
    this.#facade.startGettingRandomJokes();
    this.fetchingJokes.set(true);
  }

  stopGettingRandomJokes(): void {
    this.#facade.stopGettingRandomJokes();
    this.fetchingJokes.set(false);
  }

  onFavourite(joke: JokeViewModel, newFavourite: boolean): void {
    if (this.#facade.getNumFavourites() > 10 && newFavourite) {
      const modal: HTMLElement & { showModal: Function } | null = document.getElementById('maxFavouritesWarningModal') as HTMLElement & { showModal: Function };
      return modal.showModal();
    }
    this.#facade.setFavourite(joke, newFavourite);
  }
}
