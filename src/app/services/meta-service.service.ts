import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Meta } from '../models/meta.model';

@Injectable({
  providedIn: 'root'
})
export class MetaServiceService {
  private readonly coleccion: AngularFirestoreCollection<Meta>;

  constructor(private firestore: AngularFirestore) {
    this.coleccion = this.firestore.collection<Meta>('metas');
  }

  // Lectura en tiempo real de la coleccion metas.
  // snapshotChanges se usa en lugar de valueChanges porque necesitamos
  // el id del documento para poder eliminarlo despues.
  leerMetas(): Observable<Meta[]> {
    return this.coleccion.snapshotChanges().pipe(
      map(acciones =>
        acciones.map(accion => {
          const datos = accion.payload.doc.data() as Meta;
          const id = accion.payload.doc.id;
          return { id, meta: datos.meta };
        })
      )
    );
  }

  agregarMeta(meta: string): Promise<unknown> {
    return this.coleccion.add({ meta } as Meta);
  }

  eliminarMeta(id: string): Promise<void> {
    return this.coleccion.doc(id).delete();
  }
}
