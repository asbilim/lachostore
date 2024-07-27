"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function StatusCard({
  status = "success",
  title = "Action Completed",
  message = "The action has been processed successfully.",
  email,
  supportLink,
  onClose,
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
  }, [status]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 300);
    }
  };

  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 30 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const getIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle className="text-green-500 size-12" />;
      case "failure":
        return <XCircle className="text-red-500 size-12" />;
      case "pending":
        return <Loader2 className="text-blue-500 size-12 animate-spin" />;
      default:
        return <CheckCircle className="text-green-500 size-12" />;
    }
  };

  const getColor = () => {
    switch (status) {
      case "success":
        return "text-green-500";
      case "failure":
        return "text-red-500";
      case "pending":
        return "text-blue-500";
      default:
        return "text-green-500";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={cardVariants}>
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center gap-4 p-6">
              <motion.div variants={iconVariants}>{getIcon()}</motion.div>
              <div className="space-y-2 text-center">
                <h3 className={`text-lg font-medium ${getColor()}`}>{title}</h3>
                <p className="text-muted-foreground">
                  {message}
                  {email && (
                    <>
                      {" "}
                      <Link
                        href={`mailto:${email}`}
                        className="text-blue-500 underline"
                        prefetch={false}>
                        {email}
                      </Link>
                      .
                    </>
                  )}
                  {supportLink && (
                    <>
                      {" "}
                      If you have any questions, please contact our{" "}
                      <Link
                        href={supportLink}
                        className="text-blue-500 underline"
                        prefetch={false}>
                        support team
                      </Link>
                      .
                    </>
                  )}
                </p>
              </div>
              {onClose && (
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="mt-4">
                  Close
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
