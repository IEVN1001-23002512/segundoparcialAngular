import { Component } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IAlumno } from './alumnos';

@Component({
  imports: [FormsModule, ReactiveFormsModule],
  selector: 'app-listaalumnos',
  styleUrl: './listaalumnos.css',
  templateUrl: './listaalumnos.html',
})
export class Listaalumnos {
  formulario!:FormGroup
  alumno:IAlumno={
    matricula:'ssss',
    nombre:'sss',
    correo:'sss',
    materia:'sss'
  }


  ngOnInit():void{
    this.formulario=new FormGroup({
      matricula:new FormControl(''),
      nombre:new FormControl(''),
      correo:new FormControl(''),
      materia:new FormControl(''),
    })
  }

  muestraAlumnos():void{
    this.alumno.matricula=this.formulario.value.matricula
    this.alumno.nombre=this.formulario.value.nombre
    this.alumno.correo=this.formulario.value.correo
    this.alumno.materia=this.formulario.value.materia
  }


}
