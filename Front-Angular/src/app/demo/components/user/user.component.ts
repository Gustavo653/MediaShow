import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { UserService } from '../../service/user.service';
import { FormField, MessageServiceSuccess } from '../../api/base';

@Component({
    templateUrl: './user.component.html',
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
export class UserComponent implements OnInit {
    loading: boolean = true;
    cols: any[] = [];
    data: any[] = [];
    fields: FormField[] = [
        { id: 'firstName', type: 'text', label: 'Nome', required: true },
        { id: 'lastName', type: 'text', label: 'Sobrenome', required: true },
        {
            id: 'role',
            type: 'listbox',
            label: 'Tipo de Usuário',
            required: true,
            options: [
                {
                    code: 'admin',
                    name: 'Administrador',
                },
                {
                    code: 'viewer',
                    name: 'Visualizador',
                },
            ],
        },
        { id: 'email', type: 'text', label: 'E-mail', required: true, email: true },
        { id: 'password', type: 'text', label: 'Senha', required: false },
    ];
    modalDialog: boolean = false;
    selectedRegistry: any;
    constructor(protected layoutService: LayoutService, private userService: UserService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

    ngOnInit() {
        this.cols = [
            {
                field: 'id',
                header: 'ID',
                type: 'number',
            },
            {
                field: 'firstName',
                header: 'Nome',
                type: 'text',
            },
            {
                field: 'lastName',
                header: 'Sobrenome',
                type: 'text',
            },
            {
                field: 'role',
                header: 'Tipo de Usuário',
                type: 'role',
            },
            {
                field: 'email',
                header: 'E-mail',
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

    createUser() {
        this.selectedRegistry = {
            email: undefined,
            firstName: undefined,
            lastName: undefined,
            password: undefined,
            role: undefined,
        };
        this.modalDialog = true;
    }

    editRegistry(registry: any) {
        this.selectedRegistry = { ...registry };
        this.selectedRegistry.password = null;
        this.modalDialog = true;
    }

    deleteRegistry(registry: any) {
        this.confirmationService.confirm({
            header: 'Deletar registro',
            message: `Tem certeza que deseja apagar o registro: ${registry.firstName}`,
            acceptLabel: 'Aceitar',
            rejectLabel: 'Rejeitar',
            accept: () => {
                this.loading = true;
                this.userService.deleteUser(registry.id).subscribe((x) => {
                    this.messageService.add(MessageServiceSuccess);
                    this.fetchData();
                });
            },
        });
    }

    getFormData(registry: any) {
        this.loading = true;
        if (!registry) {
            this.loading = false;
            this.modalDialog = false;
        } else {
            if (registry.id) {
                this.userService.updateUser(registry.id, registry.firstName, registry.lastName, registry.email, registry.role, registry.password).subscribe((x) => {
                    this.fetchData();
                    this.modalDialog = false;
                });
            } else {
                this.userService.createUser(registry.firstName, registry.lastName, registry.email, registry.role, registry.password).subscribe((x) => {
                    this.fetchData();
                    this.modalDialog = false;
                });
            }
        }
    }

    fetchData() {
        this.userService.getUsers().subscribe((x) => {
            this.data = x;
            this.loading = false;
        });
    }
}
