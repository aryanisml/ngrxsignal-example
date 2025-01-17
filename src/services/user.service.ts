import { HttpClient } from "@angular/common/http";
import { UserFormData } from "../store/user.model";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
export class UserService {
    #url = 'http://localhost:3000/api'; // Node.js backend URL
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