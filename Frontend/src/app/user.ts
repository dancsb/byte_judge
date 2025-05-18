import { Friend } from "./friend";

export interface User {
    _id: string;
    user_name: string;
    email: string;
    friendNameList: Friend[];
    friendRequestsNumber: number;
}

export interface Username {
    username: string;
}
