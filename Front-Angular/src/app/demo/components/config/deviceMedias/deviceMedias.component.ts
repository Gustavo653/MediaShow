import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormField, MessageServiceSuccess } from 'src/app/demo/api/base';
import { DeviceService } from 'src/app/demo/service/device.service';
import { DeviceMediaService } from 'src/app/demo/service/deviceMedia.service';
import { MediaService } from 'src/app/demo/service/media.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    templateUrl: './deviceMedias.component.html',
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
export class DeviceMediasComponent implements OnInit {
    loading: boolean = true;
    cols: any[] = [];
    data: any[] = [];
    devices: any[] = [];
    medias: any[] = [];
    fields: FormField[] = [];
    modalDialog: boolean = false;
    selectedRegistry: any;
    constructor(
        protected layoutService: LayoutService,
        private deviceService: DeviceService,
        private mediaService: MediaService,
        private deviceMediaService: DeviceMediaService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.cols = [
            {
                field: 'Media.name',
                header: 'Nome Mídia',
                type: 'text',
            },
            {
                field: 'Media.type',
                header: 'Tipo Mídia',
                type: 'type',
            },
            {
                field: 'Device.name',
                header: 'Nome Dispositivo',
                type: 'text',
            },
            {
                field: 'Device.serialNumber',
                header: 'Serial Number Dispositivo',
                type: 'text',
            },
            {
                field: 'time',
                header: 'Tempo',
                type: 'text',
            },
            {
                field: 'createdAt',
                header: 'Criado em',
                type: 'date',
                format: 'dd/MM/yy HH:mm:ss',
            },
            {
                field: 'updatedAt',
                header: 'Atualizado em',
                type: 'date',
                format: 'dd/MM/yy HH:mm:ss',
            },
            {
                field: '',
                header: 'Editar',
                type: 'edit',
            },
            {
                field: '',
                header: 'Apagar',
                type: 'delete',
            },
        ];
        this.fetchData();
    }

    event(selectedItems: any) {
        if (selectedItems.type == 0) {
        } else if (selectedItems.type == 1) {
            this.editRegistry(selectedItems.data);
        } else if (selectedItems.type == 2) {
            this.deleteRegistry(selectedItems.data);
        } else {
            console.error(selectedItems);
        }
    }

    create() {
        this.selectedRegistry = {};
        this.modalDialog = true;
    }

    editRegistry(registry: any) {
        this.selectedRegistry = { ...registry };
        this.modalDialog = true;
    }

    deleteRegistry(registry: any) {
        this.confirmationService.confirm({
            header: 'Deletar registro',
            message: 'Tem certeza que deseja apagar o registro',
            acceptLabel: 'Aceitar',
            rejectLabel: 'Rejeitar',
            accept: () => {
                this.loading = true;
                this.deviceMediaService.deleteDeviceMedia(registry).subscribe((x) => {
                    this.messageService.add(MessageServiceSuccess);
                    this.fetchData();
                });
            },
        });
    }

    getFormData(registry: any) {
        this.loading = true;
        this.modalDialog = false;
        if (!registry) {
            this.fetchData();
        } else {
            this.deviceMediaService.createDeviceMedia(registry).subscribe((x) => {
                this.fetchData();
            });
        }
    }

    fetchData() {
        this.loading = true;
        this.fields = [
            { id: 'deviceId', type: 'dropdown', label: 'Dispositivo', required: true, options: [] },
            { id: 'mediaId', type: 'dropdown', label: 'Mídia', required: true, options: [] },
            { id: 'time', type: 'number', label: 'Tempo', required: true },
        ];
        this.deviceService.getDevices().subscribe((devices) => {
            this.devices = devices;
            const devicesOptions = this.devices.map((device) => ({ code: device.id, name: device.name }));
            this.fields[0].options = devicesOptions;
        });

        this.mediaService.getMedias().subscribe((medias) => {
            this.medias = medias;
            const mediasOptions = this.medias.map((media) => ({ code: media.id, name: media.name }));
            this.fields[1].options = mediasOptions;
        });

        this.deviceMediaService.getDeviceMedias().subscribe((x) => {
            this.data = x;
            this.loading = false;
        });
    }
}
