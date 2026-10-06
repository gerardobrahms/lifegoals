import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  nombre = 'Gerardo Brahms';
  correo = 'gerardobrahms@hotmail.com';
  telefono = '993 162 5113';
  telefonoEnlace = '+529931625113';
}
