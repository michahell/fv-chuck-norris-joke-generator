import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Joke } from './joke';
import { JokeViewModel } from '../../services/jokes.model';
import { vi } from 'vitest';

describe('Joke', () => {
  let component: Joke;
  let fixture: ComponentFixture<Joke>;

  const mockJoke: JokeViewModel = {
    id: '123',
    value: 'Chuck Norris can slam a revolving door.',
    categories: [],
    created_at: '2023-01-01',
    icon_url: 'icon.png',
    updated_at: '2023-01-01',
    url: 'https://api.chucknorris.io/jokes/123',
    isFavourite: false,
    visibleInStream: true
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Joke],
    }).compileComponents();

    fixture = TestBed.createComponent(Joke);
    component = fixture.componentInstance;
    // Set required input
    fixture.componentRef.setInput('joke', mockJoke);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the joke value', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain(mockJoke.value);
  });

  it('should have a pink heart if it is a favourite', () => {
    fixture.componentRef.setInput('joke', { ...mockJoke, isFavourite: true });
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg?.getAttribute('fill')).toBe('pink');
  });

  it('should have a none-filled heart if it is not a favourite', () => {
    fixture.componentRef.setInput('joke', { ...mockJoke, isFavourite: false });
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg?.getAttribute('fill')).toBe('none');
  });

  it('should emit favourited event when the button is clicked', () => {
    const spy = vi.spyOn(component.favourited, 'emit');
    const button = fixture.nativeElement.querySelector('button');
    button?.click();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should emit false when unfavouriting', () => {
    fixture.componentRef.setInput('joke', { ...mockJoke, isFavourite: true });
    fixture.detectChanges();
    const spy = vi.spyOn(component.favourited, 'emit');
    const button = fixture.nativeElement.querySelector('button');
    button?.click();
    expect(spy).toHaveBeenCalledWith(false);
  });
});
