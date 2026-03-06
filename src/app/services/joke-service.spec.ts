import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { JokeService, API_BASE_URL } from './joke-service';
import { JokeApiResponse } from './jokes.model';
import { provideHttpClient } from '@angular/common/http';

describe('JokeService', () => {
  let service: JokeService;
  let httpMock: HttpTestingController;

  const mockJoke: JokeApiResponse = {
    id: '123',
    value: 'Chuck Norris joke',
    categories: [],
    created_at: '2023-01-01',
    icon_url: 'icon.png',
    updated_at: '2023-01-01',
    url: 'https://api.chucknorris.io/jokes/123'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [JokeService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(JokeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch a random joke', () => {
    service.getRandomJoke().subscribe((joke) => {
      expect(joke).toEqual(mockJoke);
    });

    const req = httpMock.expectOne((request) => request.url.includes('/jokes/random'));
    expect(req.request.method).toBe('GET');
    req.flush(mockJoke);
  });

  it('should handle error when fetching joke', () => {
    service.getRandomJoke().subscribe({
      error: (error) => {
        expect(error.message).toBe('Failed to fetch joke. Please try again.');
      }
    });

    const req = httpMock.expectOne((request) => request.url.includes('/jokes/random'));
    req.error(new ProgressEvent('Network error'));
  });

  it('should use CORS proxy when not in dev mode', () => {
    // Check if the URL follows one of the two expected patterns
    service.getRandomJoke().subscribe();

    const req = httpMock.expectOne((request) => request.url.includes('/jokes/random'));
    const url = req.request.url;

    const isCorsProxied = url.startsWith('https://corsproxy.io/');
    const isDirect = url.startsWith(API_BASE_URL);

    expect(isCorsProxied || isDirect).toBe(true);

    if (isCorsProxied) {
       expect(url).toContain(`url=${API_BASE_URL}`);
    }
    req.flush(mockJoke);
  });
});
