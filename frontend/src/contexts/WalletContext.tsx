import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ethers } from "ethers";
import { useNotification } from "./NotificationContext";

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  provider: ethers.BrowserProvider | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showNotification } = useNotification();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  // 检查是否有保存的连接状态
  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      // 尝试重新连接
      connect().catch((error) => {
        console.error("自动重连失败:", error);
        localStorage.removeItem("walletAddress");
      });
    }
  }, []);

  // 监听账户变化
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // 用户断开了连接
        disconnect();
      } else if (accounts[0] !== address) {
        // 账户已更改
        setAddress(accounts[0]);
        localStorage.setItem("walletAddress", accounts[0]);
        showNotification("info", "钱包账户已更改", `当前账户: ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`);
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      const newChainId = parseInt(chainIdHex, 16);
      setChainId(newChainId);
      
      // 检查是否是BNB链
      if (newChainId !== 56 && newChainId !== 97) {
        showNotification("warning", "网络不支持", "请切换到BNB Smart Chain主网或测试网");
      } else {
        showNotification("info", "网络已更改", newChainId === 56 ? "当前网络: BNB Smart Chain" : "当前网络: BNB Testnet");
      }
    };

    const handleDisconnect = (error: { code: number; message: string }) => {
      console.error("钱包连接中断:", error);
      disconnect();
      showNotification("error", "钱包连接中断", error.message);
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
      window.ethereum.on("disconnect", handleDisconnect);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
        window.ethereum.removeListener("disconnect", handleDisconnect);
      }
    };
  }, [address, showNotification]);

  // 连接钱包
  const connect = async () => {
    if (!window.ethereum) {
      showNotification("error", "无法连接钱包", "请安装MetaMask或其他兼容的钱包");
      throw new Error("请安装MetaMask或其他兼容的钱包");
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (accounts.length === 0) {
        throw new Error("未授权访问钱包");
      }

      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      
      setProvider(provider);
      setAddress(accounts[0]);
      setChainId(chainId);
      setIsConnected(true);
      
      localStorage.setItem("walletAddress", accounts[0]);
      
      // 检查是否是BNB链
      if (chainId !== 56 && chainId !== 97) {
        showNotification("warning", "网络不支持", "请切换到BNB Smart Chain主网或测试网");
      }
      
      return accounts[0];
    } catch (error: any) {
      console.error("连接钱包时出错:", error);
      showNotification("error", "连接钱包失败", error.message || "未知错误");
      throw error;
    }
  };

  // 断开钱包连接
  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
    setChainId(null);
    setProvider(null);
    localStorage.removeItem("walletAddress");
  };

  // 切换到BNB链
  const switchToBNBChain = async () => {
    if (!window.ethereum) return;
    
    try {
      // 尝试切换到BNB链
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x38" }], // 56 in hex
      });
    } catch (error: any) {
      // 如果链未添加，则添加它
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x38", // 56 in hex
                chainName: "BNB Smart Chain",
                nativeCurrency: {
                  name: "BNB",
                  symbol: "BNB",
                  decimals: 18,
                },
                rpcUrls: ["https://bsc-dataseed.binance.org/"],
                blockExplorerUrls: ["https://bscscan.com/"],
              },
            ],
          });
        } catch (addError) {
          console.error("添加BNB链时出错:", addError);
        }
      }
      console.error("切换网络时出错:", error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        chainId,
        provider,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};