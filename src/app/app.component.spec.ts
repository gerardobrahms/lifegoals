import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [AppComponent]
    }).compileComponents();
  });

  it('se crea la aplicacion', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('muestra el menu con las dos rutas del ejercicio', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const enlaces: HTMLAnchorElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('nav a')
    );

    expect(enlaces.length).toBe(2);
    expect(enlaces.map(a => a.getAttribute('routerLink'))).toEqual(['/home', '/about']);
  });
});
