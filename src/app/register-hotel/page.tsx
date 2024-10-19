"use client";
import { Input } from "@/app/components/ui/input";
import { toast } from "@/app/hooks/use-toast";
import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Label } from "@components/ui/label";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import ImageListPreview from "../components/image-field/image-list-preview";
import UploadImages from "../components/image-field/upload-images";
import UploadThumbnail from "../components/image-field/upload-thumbnail";
import RedStar from "../components/redstar/redstar";
import { Checkbox } from "../components/ui/checkbox";
import { Textarea } from "../components/ui/textarea";
import { facilities, policies } from "../constant/constant";
import { HotelProps } from "../data/mockupData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import useAxios from "../hooks/use-axios";
import { Province } from "../home/components/search-group";
import { useRouter } from "next/navigation";

const RegisterHotel = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<HotelProps>();

  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [provinceId, setProvinceId] = useState<number | null>(null); // Use null for initial state

  const { triggerFetch: fetchProvinces, responseData: provinces } = useAxios<
    Province[],
    undefined
  >({
    endpoint: "/api/province/list",
    method: "GET",
    config: {},
  });

  const {
    triggerFetch: registerHotel,
    responseData: success,
    finished,
    error,
  } = useAxios<any, any>({
    endpoint: "/api/hotel/create",
    method: "POST",
    config: {},
  });

  useEffect(() => {
    fetchProvinces?.();
  }, []);

  const router = useRouter();

  useEffect(() => {
    if (success) {
      console.log(success);
      router.back();
      toast({
        title: "Hotel Registered",
        description: "Your hotel has been successfully registered.",
      });
    }
  }, [success]);

  useEffect(() => {
    if (finished) {
      // reset();
      setHotel({
        name: "",
        address: "",
        province_id: 0,
        description: "",
        thumbnail: undefined,
        images: [],
        open_at: "",
        close_at: "",
        facilities: [],
        policies: [],
      });
    }
  }, [finished]);

  useEffect(() => {
    if (error) {
      console.log(error);
      toast({
        title: "Hotel Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);
  // console.log(provinceId);

  const [hotel, setHotel] = useState<{
    name: string;
    province_id: number;
    address: string;
    description?: string;
    thumbnail: File | undefined;
    images?: File[] | null;
    open_at: string;
    close_at: string;
    facilities?: string[];
    policies?: string[];
  }>({
    name: "",
    address: "",
    province_id: provinceId || 0,
    description: "",
    thumbnail: undefined,
    images: [],
    open_at: "",
    close_at: "",
    facilities: [],
    policies: [],
  });

  const onSubmit: SubmitHandler<HotelProps> = async (data) => {
    const trimmedData = {
      ...data,
      name: data.name.trim(),
      address: data.address?.trim(),
      description: data.description?.trim(),
    };

    const formData = new FormData();
    formData.append("name", trimmedData.name);
    formData.append("address", trimmedData.address || "");
    formData.append("province_id", data.province_id);
    formData.append("description", trimmedData.description || "");
    formData.append("open_at", data.open_at);
    formData.append("close_at", data.close_at);
    formData.append("thumbnail", trimmedData.thumbnail || "");

    // Append images to FormData
    trimmedData.images?.forEach((image) => {
      formData.append("images[]", image);
    });

    // Append facilities to FormData
    trimmedData.facilities?.forEach((facility) => {
      formData.append("facilities[]", facility);
    });

    // Append policies to FormData
    trimmedData.policies?.forEach((policy) => {
      formData.append("policies[]", policy);
    });

    console.log("Submitting the form with the following data:", formData);
    registerHotel?.(formData);
  };

  const handleFacilityChange = (facility: string, checked: boolean) => {
    const updatedFacilities = checked
      ? [...hotel.facilities, facility]
      : hotel.facilities.filter((f) => f !== facility);

    setHotel((prev) => ({ ...prev, facilities: updatedFacilities }));
    setValue("facilities", updatedFacilities); // Update react-hook-form state
  };

  const handleThumbnailChange = (file: File) => {
    setHotel((prev) => ({ ...prev, thumbnail: file }));
    setValue("thumbnail", file);
  };

  const handleDeleteImage = (index: number) => {
    setHotel((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setValue(
      "images",
      hotel.images.filter((_, i) => i !== index)
    );
  };
  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    const selectedProvinceData = provinces.find((p) => p.name === value);
    const id = selectedProvinceData ? selectedProvinceData.id : null;
    setProvinceId(id);
    setValue("province_id", id);
    setHotel((prev) => ({ ...prev, province_id: id || 0 }));
  };
  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Register Your Hotel</CardTitle>
            <CardDescription>
              Enter the details of your hotel to register it on our platform.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div>
                <Label htmlFor="name">
                  Hotel Name <RedStar />
                </Label>
                <Input
                  className="w-full"
                  id="name"
                  placeholder="Please enter name"
                  {...register("name", { required: "Hotel name is required" })}
                />
                {errors.name && (
                  <span className="text-red-500 pt-0 text-sm">
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* Address */}
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  className="w-full"
                  id="address"
                  placeholder="Please enter address"
                  {...register("address")}
                />
                {errors.address && (
                  <span className="text-red-500 pt-0 text-sm">
                    {errors.address.message}
                  </span>
                )}
              </div>

              {/* Province */}
              <div>
                <Label htmlFor="province_id">
                  Province <RedStar />
                </Label>

                <Select
                  value={selectedProvince}
                  onValueChange={handleProvinceChange} // Update onValueChange
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces?.map((p) => (
                      <SelectItem key={p.id} value={p.name}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <input
                  type="hidden"
                  {...register("province_id", {
                    required: "Province is required",
                  })}
                />

                {errors.province_id && (
                  <span className="text-red-500 pt-0 text-sm">
                    {errors.province_id.message || "Province is required"}
                  </span>
                )}
              </div>

              {/* facilities */}
              <div>
                <Label htmlFor="facilities">Facilities</Label>

                <div className="grid grid-cols-2 gap-2">
                  {facilities.map((facility, index) => (
                    <div key={index} className="flex items-center">
                      <Checkbox
                        id={`facility-${index}`}
                        value={facility}
                        checked={hotel.facilities.includes(facility)} // Ensure checkbox reflects state
                        onCheckedChange={(checked) =>
                          handleFacilityChange(facility, checked)
                        } // Use the new handler
                        className="mr-2"
                      />
                      <Label
                        className="hover:cursor-pointer"
                        htmlFor={`facility-${index}`}
                      >
                        {facility}
                      </Label>
                    </div>
                  ))}
                  {errors.facilities && (
                    <span className="text-red-500 pt-0 text-sm">
                      {errors.facilities.message}
                    </span>
                  )}
                </div>
              </div>

              {/* policies */}
              <div>
                <Label htmlFor="policies">Policies</Label>
                <div className="grid grid-cols-2 gap-2">
                  {policies.map((policy, index) => (
                    <div key={index} className="flex items-center">
                      <Checkbox
                        id={`policies-${index}`}
                        value={policy}
                        onCheckedChange={(checked) => {
                          setHotel((prev) => ({
                            ...prev,
                            policies: checked
                              ? [...prev.policies, policy]
                              : prev.policies?.filter((p) => p !== policy),
                          }));
                          setValue(
                            "policies",
                            checked
                              ? [...hotel.policies, policy]
                              : hotel.policies?.filter((p) => p !== policy)
                          );
                        }}
                        className="mr-2"
                      />
                      <Label
                        className="hover:cursor-pointer"
                        htmlFor={`policies-${index}`}
                      >
                        {policy}
                      </Label>
                    </div>
                  ))}
                  {errors.policies && (
                    <span className="text-red-500 pt-0 text-sm">
                      {errors.policies.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  className="w-full"
                  id="description"
                  placeholder="Please enter description"
                  {...register("description")}
                />
                {errors.description && (
                  <span className="text-red-500 pt-0 text-sm">
                    {errors.description.message}
                  </span>
                )}
              </div>

              {/* Thumbnail Upload */}
              <div className="flex flex-col space-y-1.5">
                <UploadThumbnail
                  isRequired
                  title="Please upload hotel profile"
                  thumbnail={hotel.thumbnail!}
                  setThumbnail={handleThumbnailChange}
                  {...register("thumbnail", {
                    required: "Hotel profile is required",
                  })}
                />
                {errors.thumbnail && (
                  <span className="text-red-500 pt-0 text-sm">
                    {errors.thumbnail.message}
                  </span>
                )}
              </div>

              {/* Additional Images */}
              <div className="flex flex-col space-y-1.5">
                <UploadImages
                  hotel={hotel}
                  setHotel={setHotel}
                  setValue={setValue}
                />
                <ImageListPreview
                  images={hotel.images}
                  handleDeleteImage={handleDeleteImage}
                />
              </div>

              {/* Time Selection */}
              <div className="flex space-x-4">
                {/* Open At */}
                <div className="flex-1">
                  <Label htmlFor="open_at">
                    Open At <RedStar />
                  </Label>
                  <Input
                    id="open_at"
                    aria-label="Open At"
                    type="time"
                    {...register("open_at", {
                      required: "Opening hour is required",
                    })}
                  />
                  <p className="text-gray-600 text-sm">
                    Format: hh:mm AM/PM e.g 07:00 AM
                  </p>
                  {errors.open_at && (
                    <span className="text-red-500 text-sm">
                      {errors.open_at.message}
                    </span>
                  )}
                </div>
                {/* Close At */}
                <div className="flex-1">
                  <Label htmlFor="close_at">
                    Close At <RedStar />
                  </Label>
                  <Input
                    id="close_at"
                    aria-label="Close At"
                    type="time"
                    {...register("close_at", {
                      required: "Closing hour is required",
                    })}
                  />
                  <p className="text-gray-600 text-sm">
                    Format: hh:mm AM/PM e.g 05:00 PM
                  </p>
                  {errors.close_at && (
                    <span className="text-red-500 text-sm">
                      {errors.close_at.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => reset()}>
              Cancel
            </Button>
            <Button type="submit">Register Hotel</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default RegisterHotel;
