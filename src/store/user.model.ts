export interface UserFormData {
    personalInfo: {
        firstName: string;
        lastName: string;
        email: string;
    };
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
    preferences: {
        notifications: boolean;
        theme: 'light' | 'dark';
    };
    loading: boolean;
    error: null;
    userId: null;
}