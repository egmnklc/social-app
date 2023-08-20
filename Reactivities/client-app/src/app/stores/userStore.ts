import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues } from "../models/users";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../router/Routes";

export default class UserStore {
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    //* !! turns the user object into a boolean
    return !!this.user;
  }

  login = async (creds: UserFormValues) => {
    try {
      const user = await agent.Account.login(creds);
      //* Reaction handles this
      store.commonStore.setToken(user.token);
      runInAction(() => {
        this.user = user;
      });
      console.log(user.token, user.username)
      router.navigate("/activities");
      store.modalStore.closeModal();
    } catch (err) {
      throw err;
    }
  };

  register = async (creds: UserFormValues) => {
    try {
      const user = await agent.Account.register(creds);
      store.commonStore.setToken(user.token);
      runInAction(() => {
        this.user = user;
      });
      console.log(user.token, user.username)
      router.navigate("/activities");
      store.modalStore.closeModal();
    } catch (err) {
      throw err;
    }
  };


  logout = () => {
    store.commonStore.setToken(null);
    //* Reaction handles this
    // localStorage.removeItem("jwt");
    this.user = null;
    router.navigate("/");
  };

  getUser = async () => {
    try {
      //* Get currenly logged in user
      const user = await agent.Account.current();
      runInAction(() => {
        this.user = user;
      });
    } catch (error) {
      console.log(error);
    }
  };
}
