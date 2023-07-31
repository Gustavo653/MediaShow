import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogComponent } from './log.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: LogComponent }])],
    exports: [RouterModule],
})
export class LogRoutingModule {}
