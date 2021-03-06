/**
 * Configure Socket IO on Client side
 */
import * as io from 'socket.io-client';
import { Observable } from "rxjs/Observable";
export class SocketIOService {
    private url: string = process.env.hostUrl;
    private socket;
    //constructor
    constructor() {

    }
    initializeSocketInstance() {
        this.socket = io(this.url);
    }
    getSocketInstance() {
        return this.socket;
    }

    /**
     * Configure event emitter -----------------------------------------
     */

    subscribeUser(userId: string) {
        let socket = this.socket;
        let userToken = localStorage.getItem('id_token');
        let data = {
            user_id: userId,
            token: userToken
        };
        // Emit socket
        socket.emit('loggedIn', data);
        socket.emit('subscribeNotification', data);
    }

    markNotificationAsRead(userId: string) {
        let socket = this.socket;
        socket.emit('readNotification', userId);
    }

    listenToNotification(): Observable<any> {
        let observable = new Observable((observer) => {
            let socket = this.socket;
            socket.on('sendNotificationsToUser', function (notifications) {
                observer.next(notifications);
            });
        });
        return observable;
    }

    sendUserCategoryBrowsingEvent(userId: String, categoryName: String) {
        let socket = this.socket;
        let data = {
            user_id: userId,
            category: categoryName
        };
        // make sure user stay on this category at least 5 seconds
        setTimeout(function () {
            socket.emit('category browsing', data);
        }, 5000);
    }

    sendUserTagsBrowsingEvent(userId: string, tags: any[]) {
        let socket = this.socket;
        let data = {
            user_id: userId,
            tags: tags
        };
        setTimeout(() => {
            socket.emit('tags browsing', data);
        });
    }

    sendIncreaseViewCountEvent(articleId: string) {
        let socket = this.socket;
        // make sure user read this article at least 10s
        setTimeout(function () {
            socket.emit('increaseViewCount', articleId);
        }, 10000);
    }

    pushNotificationToUsers(userList: any[]) {
        let socket = this.socket;
        socket.emit('pushNotificationToUsers', userList);
    }





    /**
     * End of configuring event emitter -----------------------------------------
     */

}


