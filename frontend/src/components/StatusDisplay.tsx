import React, { useState, useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { whitelistApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FiCheck, FiX } from "react-icons/fi";

const StatusDisplay: React.FC = () => {
  const { isConnected, address } = useWallet();
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      if (!isConnected || !address) {
        setIsVerified(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await whitelistApi.checkWalletStatus(address);
        setIsVerified(response.data.isVerified);
      } catch (error: any) {
        console.error("检查状态时出错:", error);
        setError(error.message || "检查状态失败");
        setIsVerified(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [isConnected, address]);

  if (!isConnected) {
    return (
      <Card className="cyber-panel w-full max-w-md">
        <CardHeader>
          <CardTitle className="cyber-text text-xl">验证状态</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-6">
          <p className="text-center text-cyber-yellow">请先连接钱包</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="cyber-panel w-full max-w-md">
        <CardHeader>
          <CardTitle className="cyber-text text-xl">验证状态</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner size="lg" />
            <p className="text-center font-cyber text-cyber-blue">加载中...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="cyber-panel w-full max-w-md">
      <CardHeader>
        <CardTitle className="cyber-text text-xl">验证状态</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center p-6">
        {error ? (
          <div className="flex flex-col items-center gap-2 text-cyber-red">
            <div className="cyber-border-pink rounded-full border-cyber-red p-2">
              <FiX className="h-8 w-8" />
            </div>
            <p className="text-center font-cyber">{error}</p>
          </div>
        ) : isVerified ? (
          <div className="flex flex-col items-center gap-2 text-cyber-green">
            <div className="cyber-border rounded-full border-cyber-green p-2">
              <FiCheck className="h-8 w-8" />
            </div>
            <p className="text-center font-cyber">已验证白名单</p>
            <p className="text-center text-sm text-cyber-blue">您的钱包已成功通过白名单验证</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-cyber-yellow">
            <div className="cyber-border rounded-full border-cyber-yellow p-2">
              <FiX className="h-8 w-8" />
            </div>
            <p className="text-center font-cyber">未验证</p>
            <p className="text-center text-sm text-cyber-blue">您的钱包尚未通过白名单验证</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusDisplay;