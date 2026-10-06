import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';

import { MetaServiceService } from './meta-service.service';

describe('MetaServiceService', () => {
  let servicio: MetaServiceService;
  let documento: { delete: jasmine.Spy };
  let coleccion: {
    snapshotChanges: jasmine.Spy;
    add: jasmine.Spy;
    doc: jasmine.Spy;
  };

  beforeEach(() => {
    documento = { delete: jasmine.createSpy('delete').and.resolveTo() };

    coleccion = {
      snapshotChanges: jasmine.createSpy('snapshotChanges').and.returnValue(
        of([
          {
            payload: {
              doc: {
                id: 'abc',
                data: () => ({ meta: 'Correr un maraton' })
              }
            }
          }
        ])
      ),
      add: jasmine.createSpy('add').and.resolveTo({ id: 'nuevo' }),
      doc: jasmine.createSpy('doc').and.returnValue(documento)
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AngularFirestore,
          useValue: { collection: () => coleccion }
        }
      ]
    });

    servicio = TestBed.inject(MetaServiceService);
  });

  it('se crea el servicio', () => {
    expect(servicio).toBeTruthy();
  });

  it('mapea el id del documento junto al campo meta', done => {
    servicio.leerMetas().subscribe(metas => {
      expect(metas).toEqual([{ id: 'abc', meta: 'Correr un maraton' }]);
      done();
    });
  });

  it('agrega un documento con un solo campo meta', async () => {
    await servicio.agregarMeta('Aprender Angular');
    expect(coleccion.add).toHaveBeenCalledWith({ meta: 'Aprender Angular' });
  });

  it('elimina el documento por id', async () => {
    await servicio.eliminarMeta('abc');
    expect(coleccion.doc).toHaveBeenCalledWith('abc');
    expect(documento.delete).toHaveBeenCalled();
  });
});
