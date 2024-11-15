import { EventData, Page } from '@nativescript/core';
import { ChatViewModel } from './chat-view-model';

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new ChatViewModel();
}