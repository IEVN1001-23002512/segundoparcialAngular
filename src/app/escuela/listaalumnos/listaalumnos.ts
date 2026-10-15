import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IAlumno } from './alumnos';

@Component({
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  selector: 'app-listaalumnos',
  styleUrl: './listaalumnos.css',
  templateUrl: './listaalumnos.html',
})
export class Listaalumnos implements OnInit{
  formulario!:FormGroup
  alumno:IAlumno[]=[]
  indiceEdicion:number=-1
    
  nuevoAlumno:IAlumno = {
    matricula:'',
    nombre:'',
    correo:'',
    materia:''
  }


  ngOnInit():void{
    this.cargarAlumnos()
    this.formulario=new FormGroup({
      matricula:new FormControl(''),
      nombre:new FormControl(''),
      correo:new FormControl(''),
      materia:new FormControl(''),
    })
  }

  agregarAlumno():void{
    if(
      this.nuevoAlumno.matricula === '' ||
      this.nuevoAlumno.nombre === '' ||
      this.nuevoAlumno.correo === '' ||
      this.nuevoAlumno.materia === '' 
    ){
      alert('Todos los campos son obligatorios');
      return;
    }

    if(this.indiceEdicion !== -1){
      this.alumno[this.indiceEdicion]={
        ...this.nuevoAlumno
      }
    }else{
      this.alumno.push({...this.nuevoAlumno})
    }

    localStorage.SetItem(
      'alumno',
      JSON.stringify(this.alumno)
    )

    this.limpiarCampos()
  }

  muestraAlumnos():void{
    this.nuevoAlumno.matricula=this.formulario.value.matricula
    this.nuevoAlumno.nombre=this.formulario.value.nombre
    this.nuevoAlumno.correo=this.formulario.value.correo
    this.nuevoAlumno.materia=this.formulario.value.materia
    this.agregarAlumno()
  }

  cargarAlumnos():void{
    const datos = localStorage.getItem('alumno');

    if (datos) {
      this.alumno = JSON.parse(datos);
    }
  }

  editarAlumnos(index:number):void{
    this.nuevoAlumno={
      ...this.nuevoAlumno[index]
    }
    const alumno=this.alumno[index]
    this.formulario.patchValue({
      matricula:alumno.matricula,
      nombre:alumno.nombre,
      correo:alumno.correo,
      materia:alumno.materia
    })

    this.indiceEdicion=index
  }

  eliminarAlumno(index:number):void{
    this.alumno.splice(index,1)
    localStorage.setItem(
      'alumno',
      JSON.stringify(this.alumno)
    )
  }
  
  limpiarCampos(): void{
    this.nuevoAlumno = {
      matricula: '',
      nombre: '',
      correo: '',
      materia: '',
    }
    this.indiceEdicion=-1
  }

}
