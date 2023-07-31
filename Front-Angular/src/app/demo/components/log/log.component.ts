import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { LogService } from '../../service/log.service';

@Component({
    templateUrl: './log.component.html',
    providers: [MessageService, ConfirmationService],
    styles: [
        `
            :host ::ng-deep .p-frozen-column {
                font-weight: bold;
            }

            :host ::ng-deep .p-datatable-frozen-tbody {
                font-weight: bold;
            }

            :host ::ng-deep .p-progressbar {
                height: 0.5rem;
            }

            .user-profile {
                display: flex;
                align-items: center;
                margin: 10px;
            }
        `,
    ],
})
export class LogComponent implements OnInit {
    loading: boolean = true;
    cols: any[] = [];
    data: any[] = [];
    constructor(protected layoutService: LayoutService, private logService: LogService) {}

    ngOnInit() {
        this.cols = [
            {
                field: 'id',
                header: 'ID',
                type: 'number',
            },
            {
                field: 'message',
                header: 'Mensagem',
                type: 'text',
            },
            {
                field: 'type',
                header: 'Tipo',
                type: 'text',
            },
            {
                field: 'createdAt',
                header: 'Criado em',
                type: 'date',
                format: 'dd/MM/yy HH:mm:ss',
            },
        ];
        this.fetchData();
    }

    fetchData() {
        this.logService.getLogs().subscribe((x) => {
            this.data = x;
            this.loading = false;
        });
    }
}
