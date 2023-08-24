import { User } from "./users";

// This file is for currently logged in user
export interface Profile {
  username: string;
  displayName: string;
  image?: string;
  bio: string;
  photos?: Photo[];
}

export class Profile implements Profile {
  constructor(user: User) {
    this.username = user.username;
    this.displayName = user.displayName;
    this.image = user.image;
    // Don't have a bio in our user object
    // This is only for attendee
  }
}

export interface Photo{
  id: string,
  url: string,
  isMain: boolean
}