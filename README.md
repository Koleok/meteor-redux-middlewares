Middlewares to sync meteor reactive sources with redux store.

- [Live demo](https://meteor-redux-middlewares-demo.herokuapp.com)
- [Demo sources on GitHub](https://github.com/samybob1/meteor-redux-middlewares-demo)
- [Package on npm](https://www.npmjs.com/package/meteor-redux-middlewares)
- [Package on Atmosphere](https://atmospherejs.com/samy/redux-middlewares)


# Installation

##### Using npm

`npm i meteor-redux-middlewares --save`

##### Using yarn

`yarn add meteor-redux-middlewares`

##### Using meteor

`meteor add samy:redux-middlewares`


# Example of use

All the following code is available on the [demo repository](https://github.com/samybob1/meteor-redux-middlewares-demo).


##### Step 1: apply middlewares

```js
  // File '/imports/store/index.js'
  import { Tracker } from 'meteor/tracker';
  import createReactiveMiddlewares from 'meteor-redux-middlewares';
  // or: import createReactiveMiddlewares from 'meteor/samy:redux-middlewares';
  import { applyMiddleware, createStore, compose } from 'redux';

  // Of course, you can use other middlewares as well
  import thunk from 'redux-thunk';
  import createLogger from 'redux-logger';

  import rootReducer from '/imports/reducers';

  // We use an injection pattern to avoid any direct dependency on the meteor
  // build tool, or version of tracker within the package.
  //
  // This way you should be able to use your meteor version, a community npm
  // version, the future extracted official mdg package etc...
  const {
    sources,
    subscriptions,
  } = createReactiveMiddlewares(Tracker);

  const store = createStore(rootReducer, compose(
    applyMiddleware(sources, subscriptions, thunk, logger)
  ));

  export default store;
```


##### Step 2: create actions

```js
  // File '/imports/actions/user/load.js'
  import { Meteor } from 'meteor/meteor';

  export const USER = 'USER';
  export const USER_CHANGED = 'USER_CHANGED';

  export function loadUser() {
    return {
      type: USER,
      meteor: {
        get: () => Meteor.user() || {},
      },
    };
  }
```

This action will automatically be intercepted by the `sources` middleware. Your `get` function is running inside a `Tracker.autorun`, that means each time the data will change, the middleware will dispatch an action with the `_CHANGED` suffix. In this example, we are dispatching an action of type `USER`, so we have to handle the `USER_CHANGED` action in our reducer.

```js
  // File '/imports/actions/home/posts/load.js'
  import { Meteor } from 'meteor/meteor';

  import { Posts } from '/imports/api/collections/posts';

  export const HOME_POSTS_SUBSCRIPTION = 'HOME_POSTS_SUBSCRIPTION';
  export const HOME_POSTS_SUBSCRIPTION_READY = 'HOME_POSTS_SUBSCRIPTION_READY';
  export const HOME_POSTS_SUBSCRIPTION_CHANGED = 'HOME_POSTS_SUBSCRIPTION_CHANGED';

  export function loadHomePosts() {
    return {
      type: HOME_POSTS_SUBSCRIPTION,
      meteor: {
        subscribe: () => Meteor.subscribe('home.posts'),
        get: () => Posts.find().fetch(),
      },
    };
  }
```

This action will automatically be intercepted by the `subscriptions` middleware. Your `get` function is running inside a `Tracker.autorun`, that means each time the data will change, the middleware will dispatch an action with the `_CHANGED` suffix. In the same way, each time the subscription will be ready (or not), the middleware will dispatch an action with the `_READY` suffix. In this example, we are dispatching an action of type `HOME_POSTS_SUBSCRIPTION`, so we have to handle the `HOME_POSTS_SUBSCRIPTION_READY` and `HOME_POSTS_SUBSCRIPTION_CHANGED` actions in our reducer.


##### Step 2: create reducers

```js
  // File '/imports/reducers/user.js'
  import { USER_CHANGED } from '/imports/actions/user/load';

  const initialState = {
    ready: false,
  };

  export function user(state = initialState, action) {
    switch (action.type) {
      case USER_CHANGED:
        return {
          ...action.data,
          ready: true,
        };
      default:
        return state;
    }
  }
```

With the **reactive sources**, we can access to the data returned by our `get` function inside the `action.data` attribute.

```js
  // File '/imports/reducers/home.js'
  import {
    HOME_POSTS_SUBSCRIPTION_READY,
    HOME_POSTS_SUBSCRIPTION_CHANGED
  } from '/imports/actions/home/posts/load';

  const initialState = {
    ready: false,
    posts: [],
  };

  export function home(state = initialState, action) {
    switch (action.type) {
      case HOME_POSTS_SUBSCRIPTION_READY:
        return {
          ...state,
          ready: action.ready,
        };
      case HOME_POSTS_SUBSCRIPTION_CHANGED:
        return {
          ...state,
          posts: action.data
        };
      default:
        return state;
    }
  }
```

With the **subscriptions**, we can access to:
- the data returned by our `get` function inside the `action.data` attribute.
- the readiness state of the subscription inside the `action.ready` attribute.


# Pass extra data to the reducer

If you need to pass some extra data to the reducer with the `subscriptions` middleware when your subscription's ready state changes, you can add an `onReadyData` attribute in your action:

```js
  import { Meteor } from 'meteor/meteor';

  import { Posts } from '/imports/api/collections/posts';

  export const HOME_POSTS_SUBSCRIPTION = 'HOME_POSTS_SUBSCRIPTION';
  export const HOME_POSTS_SUBSCRIPTION_READY = 'HOME_POSTS_SUBSCRIPTION_READY';
  export const HOME_POSTS_SUBSCRIPTION_CHANGED = 'HOME_POSTS_SUBSCRIPTION_CHANGED';

  export function loadHomePosts() {
    return {
      type: HOME_POSTS_SUBSCRIPTION,
      meteor: {
        subscribe: () => Meteor.subscribe('home.posts'),
        get: () => Posts.find().fetch(),
        onReadyData: () => ({
          extraKey1: 'extraValue1',
          extraKey2: 'extraValue2',
        }),
      },
    };
  }
```

Then in your reducer, you can access to the extra data by using the `data` attribute;

```js
  import {
    HOME_POSTS_SUBSCRIPTION_READY,
    HOME_POSTS_SUBSCRIPTION_CHANGED
  } from '/imports/actions/home/posts/load';

  const initialState = {
    ready: false,
    posts: [],
  };

  export function home(state = initialState, action) {
    switch (action.type) {
      case HOME_POSTS_SUBSCRIPTION_READY:
        // This will log: Object { extraKey1="extraValue1", extraKey2="extraValue2" }
        console.log(action.data);

        return {
          ...state,
          ready: action.ready,
        };
      case HOME_POSTS_SUBSCRIPTION_CHANGED:
        return {
          ...state,
          posts: action.data
        };
      default:
        return state;
    }
  }
```


# Credits

Based on the work of [Gildas Garcia (@djhi)](https://github.com/djhi) on his [My-Nutrition project](https://github.com/djhi/my-nutrition/tree/master/app/client/middlewares).
Thanks to [Kyle Chamberlain (@Koleok)](https://github.com/Koleok) for his [contribution](https://github.com/samybob1/meteor-redux-middlewares/commits/master?author=Koleok).
