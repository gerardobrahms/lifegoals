import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Meta } from '../models/meta.model';
import { MetaServiceService } from '../services/meta-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  metas: Meta[] = [];
  nuevaMeta = '';
  cargando = true;
  error = '';

  private suscripcion?: Subscription;

  constructor(private metaService: MetaServiceService) {}

  ngOnInit(): void {
    this.suscripcion = this.metaService.leerMetas().subscribe({
      next: metas => {
        this.metas = metas;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo leer la coleccion metas. Revisa las keys de Firestore y las reglas de seguridad.';
        this.cargando = false;
      }
    });
  }

  // La lista no se refresca a mano. snapshotChanges emite de nuevo
  // en cuanto Firestore confirma la escritura, asi que basta con limpiar el input.
  agregar(): void {
    const texto = this.nuevaMeta.trim();
    if (!texto) {
      return;
    }

    this.metaService
      .agregarMeta(texto)
      .then(() => (this.nuevaMeta = ''))
      .catch(() => (this.error = 'No se pudo guardar la meta.'));
  }

  eliminar(id?: string): void {
    if (!id) {
      return;
    }

    this.metaService
      .eliminarMeta(id)
      .catch(() => (this.error = 'No se pudo eliminar la meta.'));
  }

  ngOnDestroy(): void {
    this.suscripcion?.unsubscribe();
  }
}
