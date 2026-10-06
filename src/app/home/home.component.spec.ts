import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { HomeComponent } from './home.component';
import { MetaServiceService } from '../services/meta-service.service';
import { Meta } from '../models/meta.model';

class MetaServiceStub {
  metas: Meta[] = [{ id: 'abc', meta: 'Correr un maraton' }];
  agregadas: string[] = [];
  eliminadas: string[] = [];

  leerMetas() {
    return of(this.metas);
  }

  agregarMeta(meta: string) {
    this.agregadas.push(meta);
    return Promise.resolve();
  }

  eliminarMeta(id: string) {
    this.eliminadas.push(id);
    return Promise.resolve();
  }
}

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let servicio: MetaServiceStub;

  beforeEach(async () => {
    servicio = new MetaServiceStub();

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [HomeComponent],
      providers: [{ provide: MetaServiceService, useValue: servicio }]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('carga las metas de la coleccion al iniciar', () => {
    expect(component.metas.length).toBe(1);
    expect(component.cargando).toBeFalse();
  });

  it('pinta una fila por meta', () => {
    const filas = fixture.nativeElement.querySelectorAll('.lista li');
    expect(filas.length).toBe(1);
  });

  it('agrega la meta sin espacios sobrantes y limpia el input', async () => {
    component.nuevaMeta = '  Aprender Angular  ';
    component.agregar();
    await fixture.whenStable();

    expect(servicio.agregadas).toEqual(['Aprender Angular']);
    expect(component.nuevaMeta).toBe('');
  });

  it('ignora el envio cuando el input esta vacio', () => {
    component.nuevaMeta = '   ';
    component.agregar();

    expect(servicio.agregadas.length).toBe(0);
  });

  it('elimina por id', () => {
    component.eliminar('abc');
    expect(servicio.eliminadas).toEqual(['abc']);
  });
});
