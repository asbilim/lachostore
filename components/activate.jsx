"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@/components/navigation";

export default function ActivateAccount({ tkey, token }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isActivated, setIsActivated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const completeUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/accounts/activate/${tkey}/${token}/`;

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await fetch(completeUrl, {
          method: "GET",
        });

        console.log("Response status:", response.status); // Log the response status

        if (response.ok) {
          setIsActivated(true);
          setTimeout(() => router.push("/en/auth/login"), 5000); // Redirect after 5 seconds
        } else {
          const data = await response.json();
          console.log("Error data:", data); // Log the error data
          setErrorMessage(data.error || "An error occurred during activation.");
        }
      } catch (error) {
        console.error("Network error:", error); // Log the network error
        setErrorMessage("Network error. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    activateAccount();
  }, [completeUrl, router]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const iconVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: { type: "spring", stiffness: 500, delay: 0.2 },
    },
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background px-4">
      <motion.div initial="hidden" animate="visible" variants={cardVariants}>
        <Card className="w-full max-w-md">
          <CardHeader>
            <h1 className="text-2xl font-bold text-center">
              Account Activation
            </h1>
          </CardHeader>
          <CardContent className="text-center">
            {isLoading ? (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p>Activating your account...</p>
              </div>
            ) : isActivated ? (
              <div className="flex flex-col items-center space-y-4">
                <motion.div variants={iconVariants}>
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </motion.div>
                <p className="text-lg font-semibold text-green-600">
                  Account successfully activated!
                </p>
                <p>You will be redirected to the login page in 5 seconds.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <motion.div variants={iconVariants}>
                  <XCircle className="h-16 w-16 text-red-500" />
                </motion.div>
                <p className="text-lg font-semibold text-red-600">
                  Activation failed
                </p>
                <p>{errorMessage}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {!isLoading && (
              <Button
                onClick={() => router.push("/en/auth/login")}
                className="mt-4">
                Go to Login
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
