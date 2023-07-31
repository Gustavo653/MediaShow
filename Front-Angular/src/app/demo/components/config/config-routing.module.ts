import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DeviceMediasComponent } from './deviceMedias/deviceMedias.component';
import { DevicesComponent } from './devices/devices.component';
import { MediasComponent } from './medias/medias.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'devices', component: DevicesComponent },
            { path: 'device-medias', component: DeviceMediasComponent },
            { path: 'medias', component: MediasComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class ConfigRoutingModule {}
