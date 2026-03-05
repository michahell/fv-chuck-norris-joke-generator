import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {JokeFacade} from './services/joke-facade';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  #facade = inject(JokeFacade);

  ngOnInit(): void {
    this.#facade.latestJokes$.subscribe();

    this.#facade.startGettingRandomJokes();

    setTimeout(() => {
      this.#facade.stopGettingRandomJokes();
    }, 5000);
  }
}
