import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import CommonStore from "./commonStore";

//* activityStore is a class but classes can be also used as types.
interface Store {
  activityStore: ActivityStore;
  commonStore: CommonStore;
}

//* Store errors coming back from API inside CommonStore()
export const store: Store = {
  activityStore: new ActivityStore(),
  commonStore: new CommonStore()
};

/*
 *  Create a React Context
 *  - The context that is stored here is the store of Store type above.
 * As we create new stores, we are going to be adding new stores or new
 * instances of these stores into the store object. All of that will be
 * available inside our React Context.
 */
export const StoreContext = createContext(store);

//* Create a React Hook that allows to use stores inside our components
//* StoreContext contains an object with an ActivityStore inside.
export function useStore(){
    return useContext(StoreContext)
}


