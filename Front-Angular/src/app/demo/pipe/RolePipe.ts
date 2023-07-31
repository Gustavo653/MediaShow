import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'role' })
export class RolePipe implements PipeTransform {
    transform(value: string): string {
        switch (value) {
            case 'admin':
                return 'Administrador';
            case 'viewer':
                return 'Visualizador';
            default:
                return value;
        }
    }
}
