import { HttpClient } from "@angular/common/http";
import { UserFormData } from "../store/user.model";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environments";

@Injectable({
    providedIn: 'root'
  })
export class UserService {
    #url = environment.apiUrl; // Node.js backend URL
    constructor(private http: HttpClient){}

    saveUser(user: UserFormData): Observable<UserFormData> {
        return this.http.post<UserFormData>(`${this.#url}/users`, user);
    }

    getUsers(): Observable<UserFormData[]> {
        return this.http.get<UserFormData[]>(`${this.#url}/users`);
    }

    updateUser(user: UserFormData): Observable<UserFormData> {
        return this.http.put<UserFormData>(`${this.#url}/users/${user.userId}`, user);
    }

    deleteUser(userId: string): Observable<void> {
        return this.http.delete<void>(`${this.#url}/users/${userId}`);
    }
}