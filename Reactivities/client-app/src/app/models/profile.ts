import { User } from "./users";

// This file is for currently logged in user
export interface IProfile {
  username: string;
  displayName: string;
  image?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  following: boolean;
  photos?: Photo[];
}

export class Profile implements IProfile {
  constructor(user: User) {
    this.username = user.username;
    this.displayName = user.displayName;
    this.image = user.image;
    // Don't have a bio in our user object
    // This is only for attendee
  }

  username: string;
  displayName: string;
  image?: string;
  bio?: string;
  followersCount = 0;
  followingCount = 0;
  following = false;
  photos?: Photo[];
}

export interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}

export interface UserActivity {
  id: string;
  title: string;
  category: string;
  date: Date;
}
