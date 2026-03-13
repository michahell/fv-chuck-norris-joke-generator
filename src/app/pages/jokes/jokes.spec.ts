import { ComponentFixture, TestBed } from '@angular/core/testing';
import Jokes from './jokes';
import { JokeFacade } from '../../services/joke-facade';
import { BehaviorSubject } from 'rxjs';
import { JokeViewModel } from '../../services/jokes.model';
import { vi } from 'vitest';
import { By } from '@angular/platform-browser';

describe('Jokes', () => {
  let component: Jokes;
  let fixture: ComponentFixture<Jokes>;
  // eslint-disable-next-line
  let facadeMock: any;
  let latestJokesSubject: BehaviorSubject<JokeViewModel[]>;

  const mockJoke: JokeViewModel = {
    id: '1',
    value: 'Joke 1',
    categories: [],
    created_at: '',
    icon_url: '',
    updated_at: '',
    url: '',
    isFavourite: false,
    visibleInStream: true,
  };

  beforeEach(async () => {
    latestJokesSubject = new BehaviorSubject<JokeViewModel[]>([]);
    facadeMock = {
      latestJokes$: latestJokesSubject.asObservable(),
      startGettingRandomJokes: vi.fn(),
      stopGettingRandomJokes: vi.fn(),
      getNumFavourites: vi.fn().mockReturnValue(0),
      setFavourite: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Jokes],
      providers: [{ provide: JokeFacade, useValue: facadeMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Jokes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should start getting jokes on init', () => {
    expect(facadeMock.startGettingRandomJokes).toHaveBeenCalled();
    expect(component.fetchingJokes()).toBe(true);
  });

  it('should display jokes when they arrive', () => {
    latestJokesSubject.next([mockJoke]);
    fixture.detectChanges();

    const jokeElements = fixture.debugElement.queryAll(By.css('app-joke'));
    expect(jokeElements.length).toBe(1);
  });

  it('should call facade.stopGettingRandomJokes when stop button is clicked', () => {
    const stopButton = fixture.debugElement.query(By.css('[data-test="stop-fetching-jokes"]'));
    stopButton.nativeElement.click();

    expect(facadeMock.stopGettingRandomJokes).toHaveBeenCalled();
    expect(component.fetchingJokes()).toBe(false);
  });

  it('should call facade.startGettingRandomJokes when restart button is clicked', () => {
    component.fetchingJokes.set(false);
    fixture.detectChanges();

    const startButton = fixture.debugElement.query(By.css('[data-test="start-fetching-jokes"]'));
    startButton.nativeElement.click();

    expect(facadeMock.startGettingRandomJokes).toHaveBeenCalled();
    expect(component.fetchingJokes()).toBe(true);
  });

  it('should set favourite when onFavourite is called and limit not reached', () => {
    component.onFavourite(mockJoke, true);
    expect(facadeMock.setFavourite).toHaveBeenCalledWith(mockJoke, true);
  });

  it('should show modal when more than 10 favourites', () => {
    facadeMock.getNumFavourites.mockReturnValue(11);

    // Mock the modal
    const mockModal = { showModal: vi.fn() };
    // @ts-expect-error mockModal does not equal HTMLElement
    vi.spyOn(document, 'getElementById').mockReturnValue(mockModal);

    component.onFavourite(mockJoke, true);

    expect(mockModal.showModal).toHaveBeenCalled();
    expect(facadeMock.setFavourite).not.toHaveBeenCalled();
  });
});
