"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, File, X, FileText, Image, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store/useAppStore";
import { uploadAPI } from "@/lib/services/api";

interface FileUploadModuleProps {
  onUploadComplete?: (fileData: UploadedFileData, file?: File) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  title?: string;
  description?: string;
}

interface UploadedFileData {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
}

const fileTypeIcons: Record<string, typeof File> = {
  pdf: FileText,
  image: Image,
  default: File,
};

export function FileUploadModule({
  onUploadComplete,
  acceptedTypes = ["application/pdf", "image/*", "text/*"],
  maxSize = 10,
  title = "Upload File",
  description = "Drag and drop your file here or click to browse",
}: FileUploadModuleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFileData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { addUploadedFile } = useAppStore();

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return fileTypeIcons.pdf;
    if (type.includes("image")) return fileTypeIcons.image;
    return fileTypeIcons.default;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size exceeds ${maxSize}MB limit`;
    }

    // Check file type
    const isAccepted = acceptedTypes.some((type) => {
      if (type.includes("*")) {
        const baseType = type.split("/")[0];
        return file.type.startsWith(baseType);
      }
      return file.type === type;
    });

    if (!isAccepted) {
      return "File type not supported";
    }

    return null;
  };

  const handleUpload = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      try {
        // Call mock API
        const response = await uploadAPI.uploadFile(file);

        clearInterval(progressInterval);
        setUploadProgress(100);

        const fileData: UploadedFileData = {
          id: response.fileId,
          name: response.fileName,
          type: response.fileType,
          size: response.fileSize,
          uploadedAt: response.uploadedAt,
        };

        setUploadedFile(fileData);
        addUploadedFile(fileData);
        onUploadComplete?.(fileData, file);
      } catch {
        clearInterval(progressInterval);
        setError("Upload failed. Please try again.");
        setUploadProgress(0);
      } finally {
        setIsUploading(false);
      }
    },
    [addUploadedFile, onUploadComplete, maxSize, acceptedTypes]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        handleUpload(file);
      }
    },
    [handleUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleUpload(file);
      }
    },
    [handleUpload]
  );

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setError(null);
  };

  const FileIcon = uploadedFile ? getFileIcon(uploadedFile.type) : File;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {!uploadedFile ? (
        <Card
          className={cn(
            "cursor-pointer border-2 border-dashed transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
            error && "border-destructive"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardContent className="flex flex-col items-center justify-center p-8">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept={acceptedTypes.join(",")}
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            <label
              htmlFor="file-upload"
              className="flex cursor-pointer flex-col items-center"
            >
              {isUploading ? (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="mt-4 text-sm text-muted-foreground">Uploading...</p>
                  <Progress value={uploadProgress} className="mt-2 h-2 w-48" />
                </motion.div>
              ) : (
                <>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="mt-4 text-center text-sm">
                    <span className="font-medium text-primary">Click to upload</span>
                    <span className="text-muted-foreground"> or drag and drop</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    PDF, Images, or Text files (max {maxSize}MB)
                  </p>
                </>
              )}
            </label>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveFile}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}

export default FileUploadModule;
