import React, { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { formatAddress } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FiCopy, FiCheck, FiExternalLink } from "react-icons/fi";

const WalletConnect: React.FC = () => {
  const { isConnected, address, connect, disconnect, chainId } = useWallet();
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connect();
    } catch (error) {
      console.error("连接钱包时出错:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const copyAddress = async () => {
    if (!address) return;
    
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("复制地址时出错:", error);
    }
  };

  const openExplorer = () => {
    if (!address) return;
    
    // BNB链浏览器地址
    const explorerUrl = `https://bscscan.com/address/${address}`;
    window.open(explorerUrl, "_blank");
  };

  return (
    <Card className="cyber-panel w-full max-w-md">
      <CardHeader>
        <CardTitle className="cyber-text text-xl">钱包连接</CardTitle>
      </CardHeader>
      <CardContent>
        {isConnected && address ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-md border border-cyber-blue bg-cyber-dark p-3">
              <span className="font-cyber text-cyber-blue">{formatAddress(address)}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyAddress}
                  className="rounded-full p-2 text-cyber-blue hover:bg-cyber-blue hover:bg-opacity-20"
                  title="复制地址"
                >
                  {copied ? <FiCheck /> : <FiCopy />}
                </button>
                <button
                  onClick={openExplorer}
                  className="rounded-full p-2 text-cyber-blue hover:bg-cyber-blue hover:bg-opacity-20"
                  title="在浏览器中查看"
                >
                  <FiExternalLink />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-cyber-yellow">网络: </span>
                <span className="text-sm text-cyber-blue">
                  {chainId === 56 ? "BNB Smart Chain" : chainId === 97 ? "BNB Testnet" : "未知网络"}
                </span>
              </div>
              <Button
                variant="outline"
                className="cyber-button border-cyber-pink text-cyber-pink hover:bg-cyber-pink hover:text-cyber-black"
                onClick={handleDisconnect}
              >
                断开连接
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className="cyber-button w-full"
            onClick={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                连接中...
              </>
            ) : (
              "连接钱包"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletConnect;