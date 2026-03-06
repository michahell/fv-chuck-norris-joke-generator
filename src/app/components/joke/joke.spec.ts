import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Joke } from './joke';

describe('Joke', () => {
  let component: Joke;
  let fixture: ComponentFixture<Joke>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Joke],
    }).compileComponents();

    fixture = TestBed.createComponent(Joke);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
