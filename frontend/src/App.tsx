import React from 'react';
import { WalletProvider } from '@/contexts/WalletContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import WalletConnect from '@/components/WalletConnect';
import WhitelistVerification from '@/components/WhitelistVerification';
import StatusDisplay from '@/components/StatusDisplay';
import CyberBackground from '@/components/CyberBackground';

function App() {
  return (
    <NotificationProvider>
      <WalletProvider>
        <div className="relative min-h-screen bg-cyber-black p-4">
          <CyberBackground />
          
          <header className="mb-8 text-center">
            <h1 className="cyber-text-yellow text-4xl font-bold">
              BNB链<span className="cyber-text-pink">白名单</span>验证系统
            </h1>
            <p className="cyber-text mt-2">连接您的钱包并验证白名单资格</p>
          </header>
          
          <main className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-8">
            <WalletConnect />
            
            <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
              <WhitelistVerification />
              <StatusDisplay />
            </div>
          </main>
          
          <footer className="mt-12 text-center">
            <p className="text-sm text-cyber-blue">
              &copy; {new Date().getFullYear()} BNB链白名单验证系统
            </p>
          </footer>
        </div>
      </WalletProvider>
    </NotificationProvider>
  );
}

export default App;