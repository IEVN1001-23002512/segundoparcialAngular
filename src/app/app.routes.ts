import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'formularios', 
        children:[
            {
                path:'usuarios',
                loadComponent:()=>
                    import('./formularios/usuarios/usuarios').then(
                        (c)=>c.Usuarios
                    ),
            },
            {
                path:'zodiaco',
                loadComponent:()=>
                    import('./formularios/zodiaco/zodiaco').then(
                        (c)=>c.Zodiaco
                    ),
            },
            {
                path:'registros',
                loadComponent:()=>
                    import('./formularios/zodiaco/registros').then(
                        (c)=>c.Registros
                    ),
            }
        ]
    },
    {
        path:'escuela',
        children:[
            {
                path:'listaalumnos',
                loadComponent:()=>
                    import('./escuela/listaalumnos/listaalumnos').then(
                        (c)=>c.Listaalumnos
                    ),
            }
        ]
    },
    {
        path:'', redirectTo:'admin', pathMatch:'full'
    },
    {
        path:'**', redirectTo:'admin'
    },
];
