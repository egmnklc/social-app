export interface User {
  username: string;
  displayName: string;
  token: string;
  image?: string;
}

//* Useable for both login and register
export interface UserFormValues {
  email: string;
  password: string;
  displayname?: string;
  userName?: string;
}
