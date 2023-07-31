import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root',
})
export class MediaService {
    constructor(private http: HttpClient, private storageService: StorageService) {}

    private getAPIURL(): Observable<string> {
        return this.storageService.getAPIURL();
    }

    getMedias(): Observable<any> {
        return this.getAPIURL().pipe(
            switchMap((url) => {
                const apiUrl = `${url}/medias`;
                return this.http.get(apiUrl);
            })
        );
    }

    createMedia(name: string): Observable<any> {
        return this.getAPIURL().pipe(
            switchMap((url) => {
                const apiUrl = `${url}/medias`;
                const body = { name };
                return this.http.post(apiUrl, body);
            })
        );
    }

    updateMedia(id: string, name: string): Observable<any> {
        return this.getAPIURL().pipe(
            switchMap((url) => {
                const apiUrl = `${url}/medias/${id}`;
                const body = { name };
                return this.http.put(apiUrl, body);
            })
        );
    }

    deleteMedia(id: string): Observable<any> {
        return this.getAPIURL().pipe(
            switchMap((url) => {
                const apiUrl = `${url}/medias/${id}`;
                return this.http.delete(apiUrl);
            })
        );
    }
}
