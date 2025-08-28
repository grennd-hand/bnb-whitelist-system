import React, { useState, useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { useNotification } from "@/contexts/NotificationContext";
import { whitelistApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FiCheck, FiX } from "react-icons/fi";

const WhitelistVerification: React.FC = () => {
  const { isConnected, address } = useWallet();
  const { showNotification } = useNotification();
  const [code, setCode] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<"none" | "success" | "error" | "already_verified">("none");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(false);

  // 检查钱包的白名单状态
  useEffect(() => {
    const checkWalletStatus = async () => {
      if (isConnected && address) {
        setIsCheckingStatus(true);
        try {
          const response = await whitelistApi.checkWalletStatus(address);
          if (response.isVerified) {
            setVerificationStatus("already_verified");
          }
        } catch (error) {
          console.error("检查钱包状态时出错:", error);
        } finally {
          setIsCheckingStatus(false);
        }
      }
    };

    checkWalletStatus();
  }, [isConnected, address]);

  // 验证白名单代码
  const handleVerify = async () => {
    if (!code.trim()) {
      setErrorMessage("请输入白名单代码");
      showNotification("error", "验证失败", "请输入白名单代码");
      return;
    }

    if (!isConnected || !address) {
      setErrorMessage("请先连接钱包");
      showNotification("error", "验证失败", "请先连接钱包");
      return;
    }

    setIsVerifying(true);
    setErrorMessage("");

    try {
      const response = await whitelistApi.verifyCode(code.trim(), address);
      if (response.success) {
        setVerificationStatus("success");
        showNotification("success", "验证成功", "您的钱包已成功通过白名单验证");
      }
    } catch (error: any) {
      console.error("验证白名单代码时出错:", error);
      setVerificationStatus("error");
      const errorMsg = error.message || "验证失败，请检查代码是否正确";
      setErrorMessage(errorMsg);
      showNotification("error", "验证失败", errorMsg);
    } finally {
      setIsVerifying(false);
    }
  };

  // 渲染验证状态
  const renderVerificationStatus = () => {
    switch (verificationStatus) {
      case "success":
        return (
          <div className="flex flex-col items-center gap-2 text-cyber-green">
            <div className="cyber-border rounded-full border-cyber-green p-2">
              <FiCheck className="h-8 w-8" />
            </div>
            <p className="text-center font-cyber">白名单验证成功！</p>
          </div>
        );
      case "error":
        return (
          <div className="flex flex-col items-center gap-2 text-cyber-red">
            <div className="cyber-border-pink rounded-full border-cyber-red p-2">
              <FiX className="h-8 w-8" />
            </div>
            <p className="text-center font-cyber">{errorMessage || "验证失败"}</p>
          </div>
        );
      case "already_verified":
        return (
          <div className="flex flex-col items-center gap-2 text-cyber-yellow">
            <div className="cyber-border rounded-full border-cyber-yellow p-2">
              <FiCheck className="h-8 w-8" />
            </div>
            <p className="text-center font-cyber">您的钱包已通过白名单验证</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (isCheckingStatus) {
    return (
      <Card className="cyber-panel w-full max-w-md">
        <CardContent className="flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner size="lg" />
            <p className="text-center font-cyber text-cyber-blue">检查白名单状态...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (verificationStatus === "already_verified") {
    return (
      <Card className="cyber-panel w-full max-w-md">
        <CardHeader>
          <CardTitle className="cyber-text text-xl">白名单验证</CardTitle>
          <CardDescription className="text-cyber-blue">您的钱包已通过白名单验证</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-6">
          {renderVerificationStatus()}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="cyber-panel w-full max-w-md">
      <CardHeader>
        <CardTitle className="cyber-text text-xl">白名单验证</CardTitle>
        <CardDescription className="text-cyber-blue">输入您的白名单代码进行验证</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              className="cyber-input"
              placeholder="输入白名单代码"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={!isConnected || isVerifying || verificationStatus === "success"}
            />
            {errorMessage && <p className="text-sm text-cyber-red">{errorMessage}</p>}
          </div>
          
          {renderVerificationStatus()}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="cyber-button w-full"
          onClick={handleVerify}
          disabled={!isConnected || isVerifying || !code.trim() || verificationStatus === "success"}
        >
          {isVerifying ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              验证中...
            </>
          ) : (
            "验证白名单"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WhitelistVerification;