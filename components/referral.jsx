"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import jwt from "jsonwebtoken";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Copy, Check, Gift } from "lucide-react";

export function ReferralModal({
  productName,
  commission,
  children,
  triggerChildren,
  session,
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();

  const getReferralLink = () => {
    if (!session?.accessToken) {
      return "";
    }

    try {
      const decoded = jwt.decode(session.accessToken);
      if (!decoded?.referral_code) {
        return "";
      }
      return `https://shop.lachofit.com${pathname}?referred_by=${decoded.referral_code}`;
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return "";
    }
  };

  const handleTriggerClick = (e) => {
    e.preventDefault();

    if (!session?.accessToken) {
      alert("Please sign in to refer a friend");
      return;
    }

    try {
      const decoded = jwt.decode(session.accessToken);
      if (decoded?.referral_code) {
        setOpen(true);
      } else {
        alert("No referral code found in your account");
      }
    } catch (error) {
      console.error("Error decoding JWT:", error);
      alert("There was an error accessing your referral information");
    }
  };

  const copyToClipboard = async () => {
    const referralLink = getReferralLink();
    if (!referralLink) {
      toast({
        title: "Error",
        description: "Unable to generate referral link. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The referral link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try copying the link manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerChildren ? (
          <div onClick={handleTriggerClick}>{triggerChildren}</div>
        ) : (
          <Button variant="outline">Share and Earn</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Referral Link</DialogTitle>
          <DialogDescription>
            Share this link with your friends and earn {commission} commission
            when they purchase {productName}!
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="referral-link" className="sr-only">
              Referral Link
            </Label>
            <Input
              id="referral-link"
              defaultValue={getReferralLink()}
              readOnly
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={copyToClipboard}
            variant={copied ? "outline" : "default"}>
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
          </Button>
        </div>
        <div className="mt-4">
          <h4 className="text-sm font-medium">How it works:</h4>
          <ol className="mt-2 list-decimal list-inside text-sm text-muted-foreground">
            <li>Share your unique referral link with friends</li>
            <li>When they make a purchase using your link, {"it's"} tracked</li>
            <li>You earn {commission} for each successful referral</li>
            <li>Commissions are paid out monthly</li>
          </ol>
        </div>
        {children}
      </DialogContent>
    </Dialog>
  );
}
