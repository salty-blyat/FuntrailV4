import { useRef, useCallback, useState, SetStateAction, Dispatch } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "@/app/hooks/use-toast"; // Ensure this is the correct path
import { HotelProps } from "@/app/register-hotel/page";
import { UseFormSetValue } from "react-hook-form";

interface UploadImagesProps {
  hotel: { images: File[] };
  setHotel:  Dispatch<SetStateAction<HotelProps>>;
  setValue: UseFormSetValue<HotelProps>;
}

const UploadImages: React.FC<UploadImagesProps> = ({
  hotel,
  setHotel,
  setValue,
}) => {
  const imagesInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const allowedTypes = ["image/jpeg", "image/png", "image/gif"]; // Specify allowed image types

  const handleImagesChange = (files: File[]) => {
    const validFiles = files.filter((file) => allowedTypes.includes(file.type));
    const invalidFiles = files.filter(
      (file) => !allowedTypes.includes(file.type)
    );

    if (validFiles.length > 0) {
      setHotel((prev) => ({
        ...prev,
        images: [...prev.images, ...validFiles],
      }));
      setValue("images", [...hotel.images, ...validFiles]);
    }

    // Notify user of invalid files
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid file type",
        description: "Only JPEG, PNG, and GIF files are allowed.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleImagesChange(selectedFiles);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      if (e.dataTransfer.files) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        handleImagesChange(droppedFiles);
      }
    },
    [handleImagesChange]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div>
      <Label htmlFor="images">Additional Images</Label>
      <div
        className={`flex items-center justify-center h-40 border-2 rounded-md p-4 cursor-pointer transition-all duration-200 ${
          isDragOver
            ? "border-blue-500 bg-blue-100"
            : "border-dashed border-gray-300 bg-white"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => imagesInputRef.current?.click()}
      >
        {hotel.images.length === 0 ? (
          <span>Drag & drop images here or click to choose</span>
        ) : (
          <span>{hotel.images.length} file(s) chosen</span>
        )}
      </div>
      <Input
        type="file"
        id="images"
        ref={imagesInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default UploadImages;
