# Dogeshit React UI

A web front end for interacting with Dogeshit.

The web app facilitates the following Dogeshit interactions:

- Converting from a supported bridged Dogecoin to Dogeshit.
- Adding Dogeshit to stake.
- Removing Dogeshit from stake.
- Claiming staking rewards.

It currently provides support for the following wallets:

- MetaMask (Browser extension)
- One Wallet (Browser extension)
- Math Wallet (Browser extension)
- Wallet Connect (Mobile Wallets)

The app provides two different styling toggles:

- Light and Dark theme toggle.
- Family Friendly/Shit Post content.

The app utilizes local storage of the browser to remember:

- Wallet Provider Preference
- Light/Dark Theme Preference
- Content Style Preference

## Dependencies

Built on React, and React Router.

Leverages Material UI as the UI kit.

Utilizes `clsx` for dynamic css generation.

Utilizes `harmony-js` and `web3` for interacting with the blockchain.

- `react`
- `react-router`
- `react-router-dom`
- `clsx`
- `@material-ui/core`
- `@material-ui/icons`
- `@material-ui/lab`
- `@fontsource/roboto`
- `@harmony-js/core`
- `@harmony-js/crypto`
- `@harmony-js/transaction`
- `@harmony-js/utils`
- `web3`
