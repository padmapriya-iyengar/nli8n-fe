import { Injectable } from "@angular/core";
import * as rx from "rxjs"
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { environment } from "src/environments/environment";

@Injectable()
export class WebSocketService{
    private subject!: AnonymousSubject<MessageEvent>;
    public messages: rx.Subject<any>;

    constructor() {
        this.messages = <rx.Subject<any>>this.connect(environment.ws_endpoint).pipe(
            rx.map(
                (response: MessageEvent): any => {
                    let data = JSON.parse(response.data)
                    return data;
                }
            )
        );
    }

    public connect(url:string): AnonymousSubject<MessageEvent> {
        if (!this.subject) {
          this.subject = this.create(url);
          console.log("Successfully connected: " + url);
        }
        return this.subject;
    }

    private create(url:string): AnonymousSubject<MessageEvent> {
        let ws = new WebSocket(url);
        let observable:any = new rx.Observable((obs: rx.Observer<MessageEvent>) => {
            ws.onmessage = obs.next.bind(obs);
            ws.onerror = obs.error.bind(obs);
            ws.onclose = obs.complete.bind(obs);
            return ws.close.bind(ws);
        });
        let observer:any = {
            error: null,
            complete: null,
            next: (data: Object) => {
                console.log('Message sent to websocket: ', data);
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(data));
                }
            }
        };
        return new AnonymousSubject<MessageEvent>(observer, observable);
    }
}