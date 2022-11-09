# P2E Game - Crypto Legions

## Links

- [Game Main server](https://play.cryptolegions.app/)
- [Game Dev server](https://dev.cryptolegions.app/)
- [Game Test1 server](https://test1.cryptolegions.app/)
- [Game Test2 server](https://test2.cryptolegions.app/)
- [Game Test3 server](https://test3.cryptolegions.app/)

## Environment

- node version - `v16.13.1`

## Work Flow

- Git Clone from https://github.com/Crypto-Legions/crypto-frontend.git
- Install `Prettier` Extension on VS Code
- Create `.env` file and input right info. You can see the keys of env from `.env.example`.
- Please check `.prettierrc` file in the file root structure.

## File Structure

- `config`
- - `game.config` (game configuration)
- - `nav.config` (navigation configuration)
- - `theme.config` (theme configuration)
- - `api.config` (api urls for dev, pro and subgraph)
- `constants`
- - `index` (constants using in game)
- - `abis` (contract abis)
- - `contractAddresses` (addresses of contracts)
- - `quotes`
- - `translations`
- `pages` (components for big pages)
- `components` (components that reused many times)
- `redux`
- - `store` (combine several reducers)
- - `reducers` (seperate into several reducers for several states)
- `types` (types for redux states and some variables)
- `services` (retrieving data from contracts and store them in the redux, and API service)
- `wallet`
- - `connector`
- - `ethereum`
- `web3hooks`
- - `contractFunctions` (getting and setting functions from and to the smart contracts)
- - `getAbi` (getting Abis)
- - `getAddress` (getting addresses of contracts)
- - `useContract` (using Contract)
- `utils` (some functions for resuable)

## Component Structure

### `Import Modules`

- import node modules at first
- then import components and functions seperatly for functionalities
- - components
- - functions
- - css
- - ...

### `Order in components`

- define constants
- define hooks variables
- define states
- useEffect
- getting functions
- handling functions
- render functions
- return part (main rendering)

### `Naming functions`

- start `get` to get any data
- start `handle` to handle or set data
- start `render` to make the small rendering part (reusable in one component)

## `Important`

After working, please remove the unused variables.
