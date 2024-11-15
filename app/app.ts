import { Application, Trace } from '@nativescript/core';
import '@nativescript/firebase-core';
import '@nativescript/firebase-database';
import '@nativescript/firebase-auth';
import { firebase } from '@nativescript/firebase-core';
import { firebaseConfig } from './config/firebase.config';

// Enable detailed tracing
Trace.enable();
Trace.write('App starting...', 'App', Trace.messageType.info);

// Add error handling for uncaught errors
Application.on(Application.uncaughtErrorEvent, (args) => {
    console.error('Uncaught error:', args.error);
});

// Initialize app with better error handling
const startApp = async () => {
    try {
        Trace.write('Initializing Firebase...', 'Firebase', Trace.messageType.info);
        
        await firebase().initializeApp(firebaseConfig);
        Trace.write('Firebase initialized successfully', 'Firebase', Trace.messageType.info);
        
        Application.run({ moduleName: 'app-root' });
        Trace.write('Application running', 'App', Trace.messageType.info);
    } catch (error) {
        console.error('Startup error:', error);
        Trace.write(`Startup error: ${error}`, 'App', Trace.messageType.error);
        
        // Start the app anyway to show an error screen
        Application.run({ moduleName: 'app-root' });
    }
};

startApp();