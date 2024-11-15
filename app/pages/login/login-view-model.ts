import { Observable, Frame } from '@nativescript/core';
import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-auth';

export class LoginViewModel extends Observable {
    private _username: string = '';
    private _password: string = '';
    private _errorMessage: string = '';
    private _isLoading: boolean = true;

    constructor() {
        super();
        this.checkInitialization();
    }

    async checkInitialization() {
        try {
            this._isLoading = true;
            this.notifyPropertyChange('isLoading', true);
            
            // Check if Firebase is initialized
            await firebase().app();
            console.log('Firebase check successful');
            
            this._isLoading = false;
            this.notifyPropertyChange('isLoading', false);
        } catch (error) {
            console.error('Firebase check failed:', error);
            this._errorMessage = 'Failed to initialize app. Please try again.';
            this._isLoading = false;
            this.notifyPropertyChange('errorMessage', this._errorMessage);
            this.notifyPropertyChange('isLoading', false);
        }
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        if (this._username !== value) {
            this._username = value;
            this.notifyPropertyChange('username', value);
        }
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        if (this._password !== value) {
            this._password = value;
            this.notifyPropertyChange('password', value);
        }
    }

    get errorMessage(): string {
        return this._errorMessage;
    }

    set errorMessage(value: string) {
        if (this._errorMessage !== value) {
            this._errorMessage = value;
            this.notifyPropertyChange('errorMessage', value);
        }
    }

    async onLogin() {
        try {
            if (!this.username || !this.password) {
                this.errorMessage = 'Please enter both email and password';
                return;
            }

            this._isLoading = true;
            this.notifyPropertyChange('isLoading', true);

            const auth = firebase().auth();
            const userCredential = await auth.signInWithEmailAndPassword(
                this.username,
                this.password
            );
            
            if (userCredential) {
                this.errorMessage = '';
                Frame.topmost().navigate({
                    moduleName: 'pages/chat/chat-page',
                    clearHistory: true
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            this.errorMessage = 'Login failed. Please check your credentials.';
        } finally {
            this._isLoading = false;
            this.notifyPropertyChange('isLoading', false);
        }
    }

    async onRegister() {
        try {
            if (!this.username || !this.password) {
                this.errorMessage = 'Please enter both email and password';
                return;
            }

            if (!this.username.includes('@')) {
                this.errorMessage = 'Please enter a valid email address';
                return;
            }

            if (this.password.length < 6) {
                this.errorMessage = 'Password must be at least 6 characters long';
                return;
            }

            this._isLoading = true;
            this.notifyPropertyChange('isLoading', true);

            const auth = firebase().auth();
            const userCredential = await auth.createUserWithEmailAndPassword(
                this.username,
                this.password
            );
            
            if (userCredential) {
                this.errorMessage = '';
                Frame.topmost().navigate({
                    moduleName: 'pages/chat/chat-page',
                    clearHistory: true
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.errorMessage = 'Registration failed. Please try again.';
        } finally {
            this._isLoading = false;
            this.notifyPropertyChange('isLoading', false);
        }
    }
}