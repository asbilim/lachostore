"use client";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useState, useEffect } from "react";

import { useSession } from "next-auth/react";

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
});

export const PersonalInfoTab = ({ texts }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    // Fetch user data when component mounts
    const fetchUserData = async () => {
      try {
        setUsername(session?.username || "");
        setEmail(session?.user?.email || "");
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Please try again later.");
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setShowErrorAlert(false);

    try {
      schema.parse({ username, email });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/accounts/update-account/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({ username, email }),
        }
      );

      if (response.ok) {
        setShowSuccessDialog(true);
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.username
            ? errorData.username
            : errorData.email || "Failed to update profile"
        );
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError(err.message || "An unexpected error occurred");
      }
      setShowErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{texts.dashboard.personalInfo.title}</CardTitle>
          <CardDescription>
            {texts.dashboard.personalInfo.description}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="username">
                  {texts.dashboard.personalInfo.labels.name}
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">
                  {texts.dashboard.personalInfo.labels.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
            {error && (
              <div className="text-red-500 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {"submitting datas"}
                </>
              ) : (
                "change your infos"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{"Info changed successfully"}</AlertDialogTitle>
            <AlertDialogDescription>
              {"Your info was changed successfully"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>{"Ok"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showErrorAlert && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{"An error occurred"}</AlertTitle>
          <AlertDescription>
            {"We could not change your information , please try again later"}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
