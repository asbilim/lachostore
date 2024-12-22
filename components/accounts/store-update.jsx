"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Upload, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export const StoreInfoTab = ({ shop, texts }) => {
  const { data: session } = useSession();
  const [storeInfo, setStoreInfo] = useState({
    name: shop.name,
    address: shop.address,
    avatar: shop.avatar,
    description: shop.description || "",
    social_media_links: {
      facebook: shop.social_media_links?.facebook || "",
      instagram: shop.social_media_links?.instagram || "",
      twitter: shop.social_media_links?.twitter || "",
    },
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState({});
  const [showImageCropDialog, setShowImageCropDialog] = useState(false);
  const [crop, setCrop] = useState({ aspect: 1 });
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [autoSave, setAutoSave] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {}, [shop]);

  useEffect(() => {
    if (autoSave) {
      const timer = setTimeout(() => {
        handleSubmit();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [storeInfo, autoSave]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id.startsWith("social-media-")) {
      const platform = id.replace("social-media-", "");
      setStoreInfo((prev) => ({
        ...prev,
        social_media_links: {
          ...prev.social_media_links,
          [platform]: value,
        },
      }));
    } else {
      setStoreInfo((prev) => ({ ...prev, [id.replace("store-", "")]: value }));
    }
    validateField(id, value);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setShowImageCropDialog(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (crop) => {
    if (imageSrc && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(imageSrc, crop);
      setCroppedImageUrl(croppedImageUrl);
    }
  };

  const getCroppedImg = (imageSrc, crop) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas is empty"));
              return;
            }
            const croppedImageUrl = URL.createObjectURL(blob);
            resolve(croppedImageUrl);
          },
          "image/jpeg",
          1
        );
      };
    });
  };

  const handleCropSave = () => {
    setStoreInfo((prev) => ({ ...prev, avatar: croppedImageUrl }));
    setShowImageCropDialog(false);
  };

  const validateField = (id, value) => {
    let newErrors = { ...errors };
    switch (id) {
      case "store-name":
        if (!value.trim()) {
          newErrors.name = "Store name is required";
        } else {
          delete newErrors.name;
        }
        break;
      case "store-address":
        if (!value.trim()) {
          newErrors.address = "Store address is required";
        } else {
          delete newErrors.address;
        }
        break;
      // Add more validation cases as needed
    }
    setErrors(newErrors);
  };

  const handleSubmit = async () => {
    if (Object.keys(errors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("name", storeInfo.name);
      formData.append("address", storeInfo.address);
      formData.append("description", storeInfo.description);

      // Append social media links
      formData.append("facebook", storeInfo.social_media_links.facebook);
      formData.append("instagram", storeInfo.social_media_links.instagram);
      formData.append("twitter", storeInfo.social_media_links.twitter);

      // If the avatar is a data URL, convert it to a file before appending
      if (storeInfo.avatar && storeInfo.avatar.startsWith("data:")) {
        const avatarFile = await fetch(storeInfo.avatar).then((r) => r.blob());
        formData.append("avatar", avatarFile, "avatar.jpg");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/store/api/${shop.id}/update/`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + session.accessToken,
          },
          body: formData,
        }
      );

      if (response.ok) {
        toast({
          title: "Store updated",
          description: "Your store information has been successfully updated.",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Update failed",
          description: errorData.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network error",
        description: "Unable to connect to the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReset = () => {
    setStoreInfo({
      name: shop.name,
      address: shop.address,
      avatar: shop.avatar,
      description: shop.description || "",
      social_media_links: {
        facebook: shop.social_media_links?.facebook || "",
        instagram: shop.social_media_links?.instagram || "",
        twitter: shop.social_media_links?.twitter || "",
      },
    });
    setErrors({});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{texts.dashboard.storeInfo.title}</CardTitle>
        <CardDescription>
          {texts.dashboard.storeInfo.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="store-name">
            {texts.dashboard.storeInfo.labels.storeName}
          </Label>
          <Input
            id="store-name"
            value={storeInfo.name}
            onChange={handleInputChange}
          />
          {errors.name && (
            <p className="text-destructive text-sm">{errors.name}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="store-address">
            {texts.dashboard.storeInfo.labels.storeAddress}
          </Label>
          <Input
            id="store-address"
            value={storeInfo.address}
            onChange={handleInputChange}
          />
          {errors.address && (
            <p className="text-destructive text-sm">{errors.address}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="store-avatar">
            {texts.dashboard.storeInfo.labels.storeAvatar}
          </Label>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-1"
              onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Avatar
            </Button>
            <input
              type="file"
              id="store-avatar"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            {storeInfo.avatar && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1"
                onClick={() =>
                  setStoreInfo((prev) => ({ ...prev, avatar: null }))
                }>
                <X className="w-4 h-4 mr-2" />
                Remove Avatar
              </Button>
            )}
          </div>
          <AnimatePresence>
            {storeInfo.avatar && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}>
                <Image
                  src={storeInfo.avatar}
                  alt="Store Avatar Preview"
                  className="mt-2 w-32 h-32 object-cover rounded"
                  width={128}
                  height={128}
                  unoptimized
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="space-y-1">
          <Label htmlFor="store-description">
            {texts.dashboard.storeInfo.labels.storeDescription}
          </Label>
          <Textarea
            id="store-description"
            value={storeInfo.description}
            onChange={handleInputChange}
            rows={4}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="social-media-links">
            {texts.dashboard.storeInfo.labels.socialMediaLinks}
          </Label>
          <Input
            id="social-media-facebook"
            placeholder="Facebook URL"
            value={storeInfo.social_media_links.facebook}
            onChange={handleInputChange}
          />
          <Input
            id="social-media-instagram"
            placeholder="Instagram URL"
            value={storeInfo.social_media_links.instagram}
            onChange={handleInputChange}
          />
          <Input
            id="social-media-twitter"
            placeholder="Twitter URL"
            value={storeInfo.social_media_links.twitter}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-save"
            checked={autoSave}
            onCheckedChange={setAutoSave}
          />
          <Label htmlFor="auto-save">Enable Auto-save</Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleReset} variant="outline">
          Reset
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={isUpdating || Object.keys(errors).length > 0}>
              {isUpdating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="mr-2">
                  <Loader2 className="w-4 h-4" />
                </motion.div>
              ) : null}
              {texts.dashboard.storeInfo.buttonText}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will update your store information. Do you want to
                continue?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>

      <Dialog open={showImageCropDialog} onOpenChange={setShowImageCropDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          {imageSrc && (
            <ReactCrop
              src={imageSrc}
              crop={crop}
              onChange={(newCrop) => setCrop(newCrop)}
              onComplete={handleCropComplete}
            />
          )}
          <DialogFooter>
            <Button
              onClick={() => setShowImageCropDialog(false)}
              variant="outline">
              Cancel
            </Button>
            <Button onClick={handleCropSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
