import localforage from 'localforage';

const resetLocalForage = () => {
  // use this in place of saveState to fix any writing errors by refreshing localForage.
  // localforage.setItem('state-v1.0.1', {});
};

export const saveState = (state) => {
  console.log(state);
  localforage.setItem('state-v1.0.1', state, (err) => {
    if (err) {
      console.log(`error saving state: ${err}`);
      // resetLocalForage();
    }
  });
  resetLocalForage();
};
export const loadState = () => localforage.getItem('state-v1.0.1', (err) => {
  if (err) {
    console.log(`error loading state: ${err}`);
    // resetLocalForage();
  }
});
