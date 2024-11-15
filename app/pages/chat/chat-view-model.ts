import { Observable } from '@nativescript/core';
import { Message } from '../../models/message.model';
import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-database';

export class ChatViewModel extends Observable {
    private _messages: Array<Message> = [];
    private _newMessage: string = '';
    private database: any;
    private messagesRef: any;

    constructor() {
        super();
        this.database = firebase().database();
        this.messagesRef = this.database.ref('messages');
        this.setupMessageListener();
    }

    get messages(): Array<Message> {
        return this._messages;
    }

    set messages(value: Array<Message>) {
        if (this._messages !== value) {
            this._messages = value;
            this.notifyPropertyChange('messages', value);
        }
    }

    get newMessage(): string {
        return this._newMessage;
    }

    set newMessage(value: string) {
        if (this._newMessage !== value) {
            this._newMessage = value;
            this.notifyPropertyChange('newMessage', value);
        }
    }

    private setupMessageListener() {
        this.messagesRef.on('value', (snapshot: any) => {
            const messagesData = snapshot.val();
            const messagesList: Array<Message> = [];
            
            if (messagesData) {
                Object.keys(messagesData).forEach(key => {
                    messagesList.push({
                        id: key,
                        ...messagesData[key]
                    });
                });
            }
            
            this.messages = messagesList.sort((a, b) => a.timestamp - b.timestamp);
        });
    }

    async sendMessage() {
        if (!this.newMessage.trim()) return;

        const currentUser = firebase().auth().currentUser;
        if (!currentUser) return;

        const message: Message = {
            text: this.newMessage.trim(),
            userId: currentUser.uid,
            username: currentUser.email?.split('@')[0] || 'Anonymous',
            timestamp: Date.now()
        };

        try {
            await this.messagesRef.push(message);
            this.newMessage = '';
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        }
    }
}