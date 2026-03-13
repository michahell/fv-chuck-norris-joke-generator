import { ComponentFixture, TestBed } from '@angular/core/testing';
import Favourites from './favourites';
import { JokeFacade } from '../../services/joke-facade';
import { BehaviorSubject } from 'rxjs';
import { JokeViewModel } from '../../services/jokes.model';
import { vi } from 'vitest';
import { By } from '@angular/platform-browser';

describe('Favourites', () => {
  let component: Favourites;
  let fixture: ComponentFixture<Favourites>;
  // eslint-disable-next-line
  let facadeMock: any;
  let favouritesSubject: BehaviorSubject<JokeViewModel[]>;

  const mockJoke: JokeViewModel = {
    id: '1',
    value: 'Favourite Joke',
    categories: [],
    created_at: '',
    icon_url: '',
    updated_at: '',
    url: '',
    isFavourite: true,
    visibleInStream: true,
  };

  beforeEach(async () => {
    favouritesSubject = new BehaviorSubject<JokeViewModel[]>([]);
    facadeMock = {
      favourites$: favouritesSubject.asObservable(),
      stopGettingRandomJokes: vi.fn(),
      loadFavouritesFromLocalStorage: vi.fn(),
      setFavourite: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Favourites],
      providers: [{ provide: JokeFacade, useValue: facadeMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Favourites);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should stop getting random jokes and load favourites on init', () => {
    expect(facadeMock.stopGettingRandomJokes).toHaveBeenCalled();
    expect(facadeMock.loadFavouritesFromLocalStorage).toHaveBeenCalled();
  });

  it('should display favourite jokes', () => {
    favouritesSubject.next([mockJoke]);
    fixture.detectChanges();

    const jokeElements = fixture.debugElement.queryAll(By.css('app-joke'));
    expect(jokeElements.length).toBe(1);
  });

  it('should remove a favourite joke when onRemoveFavourite is called', () => {
    component.onRemoveFavourite(mockJoke);
    expect(facadeMock.setFavourite).toHaveBeenCalledWith(mockJoke, false);
  });
});
