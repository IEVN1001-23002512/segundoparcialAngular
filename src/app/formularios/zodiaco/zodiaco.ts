import { Component } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IZodiaco } from './interface';

@Component({
  imports: [FormsModule, ReactiveFormsModule],
  selector: 'app-zodiaco',
  styleUrl: './zodiaco.css',
  templateUrl: './zodiaco.html',
})
export class Zodiaco {
  formulario!: FormGroup;
  usuario:IZodiaco={
    nombre: '',
    apaterno: '',
    amaterno: '',
    dia: 0,
    mes: 0,
    anio: 0,
    sexo: ''
  };

  edad: number=0;
  signo: string='';
  imagen: string='';
  mostrar: boolean=false;

  ngOnInit():void{
    this.formulario = new FormGroup({
    nombre: new FormControl('', Validators.required),
    apaterno: new FormControl('', Validators.required),
    amaterno: new FormControl('', Validators.required),
    dia: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.max(31)
    ]),
    mes: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.max(12)
    ]),
    anio: new FormControl('', [
      Validators.required,
      Validators.min(1900),
      Validators.max(new Date().getFullYear())
    ]),
    sexo: new FormControl('', Validators.required)
    });
  }

  imprimir(): void{
    if (this.formulario.invalid) {

      this.formulario.markAllAsTouched();

      this.mostrar = false;

      alert('Debes llenar todos los campos y seleccionar tu sexo antes de imprimir.');

      return;

    }

  const dia = Number(this.formulario.value.dia);
  const mes = Number(this.formulario.value.mes);
  const anio = Number(this.formulario.value.anio);

  const fecha = new Date(anio, mes - 1, dia);
  const hoy = new Date();

  hoy.setHours(0, 0, 0, 0);

  if (
    fecha.getDate() !== dia ||
    fecha.getMonth() + 1 !== mes ||
    fecha.getFullYear() !== anio ||
    fecha > hoy
  ) {

    this.mostrar = false;

    alert('Ingresa una fecha de nacimiento válida.');

    return;

  }

    this.usuario.nombre = this.formulario.value.nombre;
    this.usuario.apaterno = this.formulario.value.apaterno;
    this.usuario.amaterno = this.formulario.value.amaterno;
    this.usuario.dia = this.formulario.value.dia;
    this.usuario.mes = this.formulario.value.mes;
    this.usuario.anio = this.formulario.value.anio;
    this.usuario.sexo = this.formulario.value.sexo;
    this.mostrar = true;
    this.calcularEdad();
    this.calcularSigno();
  }

  calcularEdad(): void {

    const hoy = new Date();

    this.edad = hoy.getFullYear() - this.usuario.anio;

    const mesActual = hoy.getMonth() + 1;
    const diaActual = hoy.getDate();

    if (
      mesActual < this.usuario.mes ||
      (mesActual === this.usuario.mes &&
       diaActual < this.usuario.dia)
    ) {
      this.edad--;
    }

  }


  calcularSigno(): void {

    const signos = [
      'Rata',
      'Buey',
      'Tigre',
      'Conejo',
      'Dragón',
      'Serpiente',
      'Caballo',
      'Cabra',
      'Mono',
      'Gallo',
      'Perro',
      'Cerdo'
    ];

    const imagenes = [
      'https://wikimon.net/images/3/37/Kumbhiramon.jpg',
      'https://wikimon.net/images/b/b0/Vajramon.jpg',
      'https://wikimon.net/images/5/5e/Mihiramon.jpg',
      'https://wikimon.net/images/b/b8/Andiramon_data.jpg',
      'https://wikimon.net/images/e/e4/Majiramon.jpg',
      'https://wikimon.net/images/3/3d/Sandiramon.jpg',
      'https://wikimon.net/images/4/42/Indaramon.jpg',
      'https://wikimon.net/images/8/88/Pajiramon.jpg',
      'https://wikimon.net/images/f/f8/Makuramon.jpg',
      'https://wikimon.net/images/e/e6/Sinduramon.jpg',
      'https://wikimon.net/images/4/45/Caturamon.jpg',
      'https://wikimon.net/images/2/2a/Vikaralamon.jpg'
    ];

    const posicion = (this.usuario.anio - 4) % 12;

    this.signo = signos[posicion];

    this.imagen = imagenes[posicion];
  }
}
