import { atom } from 'jotai';

export const optionsAtom = atom({
  interface: 'consumer-api',
  restURL: '',
  noUpdate: true,
});
export const mnemonicAtom = atom('');
export const walletConnectedAtom = atom(false);
// Atom to store the wallet instance
export const walletAtom = atom(null);
export const priceAtom = atom(0);
export const balanceAtom = atom(0); // Default balance is 0 (in BCH)
// Refresh trigger atom (no readable value)
export const balanceRefreshTriggerAtom = atom(null, (get, set) => {
  set(balanceAtom, get(balanceAtom)); // Trigger a refresh
});
export const busyAtom = atom(false);

// Atoms for script loading state
export const scriptLoadedAtom = atom(false);
export const scriptErrorAtom = atom(null);

