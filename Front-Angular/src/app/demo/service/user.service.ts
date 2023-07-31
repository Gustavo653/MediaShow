import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private http: HttpClient, private storageService: StorageService) {}

    private getAPIURL(): Observable<string> {
        return this.storageService.getAPIURL();
    }

    getUsers(): Observable<any> {
        return this.getAPIURL().pipe(
            switchMap((url) => {
                const apiUrl = `${url}/users`;
                return this.http.get(apiUrl);
            })
        );
    }

    createUser(firstName: string, lastName: string, email: string, role: string, password: string): Observable<any> {
        return this.getAPIURL().pipe(
            switchMap((url) => {
                const apiUrl = `${url}/users`;
                const body = { firstName, lastName, email, role, password };
                return this.http.post(apiUrl, body);
            })
        );
    }

    updateUser(id: string, firstName: string, lastName: string, email: string, role: string, password: string): Observable<any> {
        return this.getAPIURL().pipe(
            switchMap((url) => {
                const apiUrl = `${url}/users/${id}`;
                const body = { firstName, lastName, email, role, password };
                return this.http.put(apiUrl, body);
            })
        );
    }

    deleteUser(id: string): Observable<any> {
        return this.getAPIURL().pipe(
            switchMap((url) => {
                const apiUrl = `${url}/users/${id}`;
                return this.http.delete(apiUrl);
            })
        );
    }
}
