import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SliderModule } from 'primeng/slider';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AtomicModule } from '../atomic/atomic.module';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';

@NgModule({
    imports: [
        CommonModule,
        UserRoutingModule,
        ConfirmDialogModule,
        DialogModule,
        RatingModule,
        ButtonModule,
        SliderModule,
        InputTextModule,
        ToggleButtonModule,
        RippleModule,
        ProgressBarModule,
        AtomicModule,
    ],
    declarations: [UserComponent],
})
export class UserModule {}
