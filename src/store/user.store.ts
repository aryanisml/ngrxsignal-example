import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals'
import { UserFormData } from "./user.model";
import { computed, inject } from '@angular/core';
import { UserService } from '../services/user.service';

interface UserState {
    users: UserFormData[];
    currentUser: UserFormData | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    users: [],
    currentUser: null,
    loading: false,
    error: null
};

export const UserStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed((store)=>({
        totalUsers : computed(()=> store.users().length)
    })),
    withMethods((store, userService = inject(UserService))=>({
        async saveUser(user: UserFormData) {
            patchState(store, { loading: true });
            console.log('saveUser', user)
            try {
                const savedUser = await userService.saveUser(user).toPromise();
                patchState(store, (state:any) => ({
                    users: [...state.users, savedUser],
                    loading: false
                }));
                return savedUser;
            } catch (error) {
                patchState(store, { 
                    error: 'Failed to save user',
                    loading: false 
                });
                throw error;
            }
        },

        async loadUsers() {
            patchState(store, { loading: true });
            try {
                const users = await userService.getUsers().toPromise();
                console.log('users list', users);
                patchState(store, { 
                    users,
                    loading: false 
                });
            } catch (error) {
                patchState(store, { 
                    error: 'Failed to load users',
                    loading: false 
                });
            }
        },

        setCurrentUser(user: UserFormData | null) {
            patchState(store, { currentUser: user });
        }
    }))
)