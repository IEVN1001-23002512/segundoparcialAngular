export interface IZodiaco {
  nombre: string;
  apaterno: string;
  amaterno: string;
  dia: number;
  mes: number;
  anio: number;
  sexo: string;
}

export interface IRegistroZ extends IZodiaco {
  edad: number;
  signo: string;
  imagen: string;
}