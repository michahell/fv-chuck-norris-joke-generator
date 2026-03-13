import { Component, computed, input, output } from '@angular/core';
import { JokeViewModel } from '../../services/jokes.model';

@Component({
  selector: 'app-joke',
  imports: [],
  templateUrl: './joke.html',
  styleUrl: './joke.css',
})
export class Joke {
  joke = input.required<JokeViewModel>();
  isFavourite = computed<boolean>(() => this.joke().isFavourite);
  favourited = output<boolean>();

  onFavourite(): void {
    this.favourited.emit(!this.isFavourite());
  }
}
