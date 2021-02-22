import { Windmill } from '@windmill/react-ui';
import { UseWalletProvider } from 'use-wallet';
import { WEB3_PROVIDER_URL } from '../config';
import { WalletProvider, YamProvider, Web3Provider, SettingsProvider, ModalProvider } from '../contexts';
import theme from '../config/default.theme';

import '../styles/globals.css';


import { ModalContainer } from '../components/Modal';

function App({ Component, pageProps }) {
  return (
    <Windmill theme={theme}>
      <Providers {...pageProps}>
        <Component {...pageProps} /> <ModalContainer />
      </Providers>{' '}
    </Windmill>
  );
}

const Providers = props => {
  return (
    <div>
      <SettingsProvider>
        <UseWalletProvider
          chainId={1}
          connectors={{
            walletconnect: {
              rpcUrl: WEB3_PROVIDER_URL
            }
          }}
        >
          <WalletProvider>
            <YamProvider>
              <Web3Provider>
                <ModalProvider> {props.children} </ModalProvider>{' '}
              </Web3Provider>{' '}
            </YamProvider>{' '}
          </WalletProvider>{' '}
        </UseWalletProvider>{' '}
      </SettingsProvider>{' '}
    </div>
  );
};

export default App;
