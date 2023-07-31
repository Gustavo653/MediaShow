import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root',
})
export class LogService {
    constructor(private http: HttpClient, private storageService: StorageService) {}

    getLogs(type?: string): Observable<any> {
        const params = type ? { type } : undefined;
        return this.storageService.getAPIURL().pipe(
            switchMap((url) => {
                return this.http.get<any>(`${url}/logs`, { params });
            })
        );
    }
}
