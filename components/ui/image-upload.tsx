"use client";

import React, { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (urls: string[]) => void;
  onRemove: (url: string) => void;
  values: {};
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  values = [],
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [uploadedResults, setUploadedResults] = useState<any>([]);

  useEffect(() => setIsMounted(true), []);

  const onUpload = (result: any) => {
    setUploadedResults((prevResults: any) => {
      const updatedResults = [...prevResults, result];
      const newUrls = updatedResults.map((file) => file?.info.secure_url);
      onChange(newUrls);
      return updatedResults;
    });
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {Array.isArray(values) &&
          values.length > 0 &&
          values.map((value, index) => (
            <div
              key={index}
              className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
            >
              <div className="z-10 absolute top-2 right-2">
                <Button
                  type="button"
                  onClick={() => onRemove(value.url)}
                  variant="destructive"
                  size="icon"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              <Image
                src={value.url}
                alt={`Image ${index}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
      </div>
      <CldUploadWidget
        onSuccess={onUpload}
        uploadPreset="sxl7cc8z"
        options={{
          maxFiles: 5,
          multiple: true,
        }}
      >
        {({ open }) => {
          const onClick = () => {
            open();
          };
          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload Images
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
