import { atom } from 'jotai';

export const optionsAtom = atom({
  interface: 'consumer-api',
  restURL: 'https://free-bch.fullstack.cash',
  noUpdate: true,
});
export const mnemonicAtom = atom('');
export const walletConnectedAtom = atom(false);
// Atom to store the wallet instance
export const walletAtom = atom(null);
export const tokensAtom = atom([]);
export const priceAtom = atom(0);
export const balanceAtom = atom(0); // Default balance is 0 (in BCH)
// Refresh trigger atoms
export const balanceRefreshTriggerAtom = atom(null, (get, set) => {
  set(balanceAtom, get(balanceAtom));
});
export const tokensRefreshTriggerAtom = atom(null, (get, set) => {
  set(tokensAtom, get(tokensAtom));
});

export const busyAtom = atom(false);
export const notificationAtom = atom(null);

// Atoms for script loading state
export const scriptLoadedAtom = atom(false);
export const scriptErrorAtom = atom(null);

