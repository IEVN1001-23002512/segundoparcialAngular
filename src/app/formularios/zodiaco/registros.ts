import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IZodiaco, IRegistroZ } from './interface';

@Component({
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  selector: 'app-registros',
  styleUrl: './registros.css',
  templateUrl: './registros.html',
})
export class Registros implements OnInit {
  registro: IRegistroZ[] = [];

  formulario!: FormGroup;

  formEditar: boolean = false;

  indiceEdicion: number = -1;

  ngOnInit(): void {

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

    this.cargarUsuarios();

  }

  cargarUsuarios(): void {

  const datos = localStorage.getItem('registrosZodiaco');

  if (datos) {

    this.registro = JSON.parse(datos) as IRegistroZ[];

    const imagenPorSigno: { [signo: string]: string } = {
      'Rata': 'https://wikimon.net/images/3/37/Kumbhiramon.jpg',
      'Buey': 'https://wikimon.net/images/b/b0/Vajramon.jpg',
      'Tigre': 'https://wikimon.net/images/5/5e/Mihiramon.jpg',
      'Conejo': 'https://wikimon.net/images/b/b8/Andiramon_data.jpg',
      'Dragón': 'https://wikimon.net/images/e/e4/Majiramon.jpg',
      'Serpiente': 'https://wikimon.net/images/3/3d/Sandiramon.jpg',
      'Caballo': 'https://wikimon.net/images/4/42/Indaramon.jpg',
      'Cabra': 'https://wikimon.net/images/8/88/Pajiramon.jpg',
      'Mono': 'https://wikimon.net/images/f/f8/Makuramon.jpg',
      'Gallo': 'https://wikimon.net/images/e/e6/Sinduramon.jpg',
      'Perro': 'https://wikimon.net/images/4/45/Caturamon.jpg',
      'Cerdo': 'https://wikimon.net/images/2/2a/Vikaralamon.jpg'
    };

    this.registro = this.registro.map(fila => ({
      ...fila,
      imagen: imagenPorSigno[fila.signo] ?? fila.imagen
    }));

    // Guardar las URL corregidas
    this.guardarRegistros();

  } else {

    this.registro = [];

  }

  }

  guardarRegistros(): void {

    localStorage.setItem(
      'registrosZodiaco',
      JSON.stringify(this.registro)
    );

  }

  editar(index: number): void {

    if (index < 0 || index >= this.registro.length) {
      return;
    }

    const usuario = this.registro[index];

    this.indiceEdicion = index;

    // Colocar los datos seleccionados en el formulario
    this.formulario.patchValue({
      nombre: usuario.nombre,
      apaterno: usuario.apaterno,
      amaterno: usuario.amaterno,
      dia: usuario.dia,
      mes: usuario.mes,
      anio: usuario.anio,
      sexo: usuario.sexo
    });

    // Mostrar el formulario de edición
    this.formEditar = true;

  }

  guardarEdicion(): void {

    if (
      this.indiceEdicion < 0 ||
      this.indiceEdicion >= this.registro.length
    ) {
      return;
    }

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();

      alert('Debes completar todos los campos.');
      return;
    }

    const dia = Number(this.formulario.value.dia);
    const mes = Number(this.formulario.value.mes);
    const anio = Number(this.formulario.value.anio);

    const fecha = new Date(anio, mes - 1, dia);
    const hoy = new Date();

    hoy.setHours(0, 0, 0, 0);

    // Validar que la fecha sea real y no futura
    if (
      fecha.getDate() !== dia ||
      fecha.getMonth() + 1 !== mes ||
      fecha.getFullYear() !== anio ||
      fecha > hoy
    ) {
      alert('Ingresa una fecha de nacimiento válida.');
      return;
    }

    const usuario: IZodiaco = {
      nombre: String(this.formulario.value.nombre).trim(),
      apaterno: String(this.formulario.value.apaterno).trim(),
      amaterno: String(this.formulario.value.amaterno).trim(),
      dia: dia,
      mes: mes,
      anio: anio,
      sexo: this.formulario.value.sexo
    };

    if (
      !usuario.nombre ||
      !usuario.apaterno ||
      !usuario.amaterno
    ) {
      alert('Escribe el nombre y ambos apellidos.');
      return;
    }

    // Recalcular la edad y el signo con los datos nuevos
    const edad = this.calcularEdad(usuario);
    const resultadoSigno = this.calcularSigno(usuario.anio);

    const registroActualizado: IRegistroZ = {
      ...usuario,
      edad: edad,
      signo: resultadoSigno.signo,
      imagen: resultadoSigno.imagen
    };

    // Actualizar la fila seleccionada, sin agregar una nueva
    this.registro[this.indiceEdicion] = registroActualizado;

    this.guardarRegistros();

    this.cancelarEdicion();

    alert('Registro actualizado correctamente.');

  }

  cancelarEdicion(): void {

    this.formEditar = false;
    this.indiceEdicion = -1;

    this.formulario.reset({
      nombre: '',
      apaterno: '',
      amaterno: '',
      dia: '',
      mes: '',
      anio: '',
      sexo: ''
    });

  }

  eliminar(index: number): void {

    if (index < 0 || index >= this.registro.length) {
      return;
    }

    if (confirm('¿Deseas eliminar este registro?')) {

      this.registro.splice(index, 1);

      // Si se elimina la fila que se estaba editando, cerrar el formulario.
      if (this.indiceEdicion === index) {
        this.cancelarEdicion();
      } else if (this.indiceEdicion > index) {
        // Ajustar el índice si se eliminó una fila anterior.
        this.indiceEdicion--;
      }

      this.guardarRegistros();

    }

  }

  calcularEdad(usuario: IZodiaco): number {

    const hoy = new Date();

    let edad = hoy.getFullYear() - usuario.anio;

    const mesActual = hoy.getMonth() + 1;
    const diaActual = hoy.getDate();

    if (
      mesActual < usuario.mes ||
      (
        mesActual === usuario.mes &&
        diaActual < usuario.dia
      )
    ) {
      edad--;
    }

    return edad;

  }

  calcularSigno(anio: number): { signo: string; imagen: string } {

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

    const posicion = (anio - 4) % 12;

    return {
      signo: signos[posicion],
      imagen: imagenes[posicion]
    };

  }
}
