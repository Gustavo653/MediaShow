import { NgModule } from '@angular/core';
import { RolePipe } from './demo/pipe/RolePipe';
import { TypePipe } from './demo/pipe/TypePipe';

@NgModule({
    declarations: [RolePipe, TypePipe],
    exports: [RolePipe, TypePipe],
})
export class SharedModule {}
