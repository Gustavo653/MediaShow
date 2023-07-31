import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SliderModule } from 'primeng/slider';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { LogRoutingModule } from './log-routing.module';
import { AtomicModule } from '../atomic/atomic.module';
import { LogComponent } from './log.component';

@NgModule({
    imports: [CommonModule, LogRoutingModule, RatingModule, ButtonModule, SliderModule, InputTextModule, ToggleButtonModule, RippleModule, ProgressBarModule, AtomicModule],
    declarations: [LogComponent],
})
export class LogModule {}
