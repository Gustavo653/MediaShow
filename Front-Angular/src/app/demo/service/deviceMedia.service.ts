import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root',
})
export class DeviceMediaService {
    constructor(private http: HttpClient, private storageService: StorageService) {}

    private getAPIURL(): Observable<string> {
        return this.storageService.getAPIURL();
    }

    getDeviceMedias(): Observable<any> {
        return this.getAPIURL().pipe(
            switchMap((url) => {
                const apiUrl = `${url}/device-medias`;
                return this.http.get(apiUrl);
            })
        );
    }

    createDeviceMedia(deviceMedia: any): Observable<any> {
        return this.getAPIURL().pipe(
            switchMap((url) => {
                const apiUrl = `${url}/device-medias`;
                return this.http.post(apiUrl, deviceMedia);
            })
        );
    }

    deleteDeviceMedia(deviceMedia: any): Observable<any> {
        return this.getAPIURL().pipe(
            switchMap((url) => {
                const apiUrl = `${url}/device-medias`;
                return this.http.delete(apiUrl, deviceMedia);
            })
        );
    }
}
