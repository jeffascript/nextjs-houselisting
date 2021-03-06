import React, { useState, useEffect, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import { Image } from "cloudinary-react";
import { SearchBox } from "./searchBox";
import {
  CreateHouseMutation,
  CreateHouseMutationVariables,
} from "src/generated/CreateHouseMutation";
// import {
//   UpdateHouseMutation,
//   UpdateHouseMutationVariables,
// } from "src/generated/UpdateHouseMutation";
import { CreateSignatureMutation } from "src/generated/CreateSignatureMutation";
import { FiUploadCloud } from "react-icons/fi";

const SIGNATURE_MUTATION = gql`
  mutation CreateSignatureMutation {
    createImageSignature {
      signature
      timestamp
    }
  }
`;

const CREATE_HOUSE_MUTATION = gql`
  mutation CreateHouseMutation($input: HouseInput!) {
    createHouse(input: $input) {
      id
    }
  }
`;

export interface IFormData {
  address: string;
  latitude: number;
  longitude: number;
  bedrooms: string; //number
  image: FileList;
}

export interface IUploadImageResponse {
  secure_url: string;
}

const uploadImage = async (
  image: File,
  signature: string,
  timestamp: number
): Promise<IUploadImageResponse> => {
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
  const formData = new FormData();
  formData.append("file", image);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp.toString());
  formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_KEY ?? ""); //if null, display "", coerce it to know it expects string

  const response = await fetch(url, {
    method: "post",
    body: formData,
  });

  return response.json();
};

export interface IHouseFormDataProps {}

export default function HouseFormData({}: IHouseFormDataProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [previewImage, setPreviewImage] = useState<string>();

  const { register, handleSubmit, setValue, errors, watch } = useForm<
    IFormData
  >({ defaultValues: {} });

  const address = watch("address");

  const [createSignature] = useMutation<CreateSignatureMutation>(
    SIGNATURE_MUTATION
  );

  useEffect(() => {
    register({ name: "address" }, { required: "Please enter your address" });
    register({ name: "latitude" }, { required: true, min: -90, max: 90 });
    register({ name: "longitude" }, { required: true, min: -180, max: 180 });
  }, [register]);

  const [createHouse] = useMutation<
    CreateHouseMutation,
    CreateHouseMutationVariables
  >(CREATE_HOUSE_MUTATION);

  const handleCreate = async (data: IFormData) => {
    // console.log("dataIformData", data);
    const { data: signatureData } = await createSignature(); //data:signatureData just to tweak it since there is another data from props, hence it adopts the main prop passed in to mutate
    if (signatureData) {
      // console.log("signatureData", data);
      const { signature, timestamp } = signatureData.createImageSignature;
      const imageData = await uploadImage(data.image[0], signature, timestamp);
      // console.log(imageData);
      /**
       * the url we are interested, returned from the response which we have declared the interface with IUploadImageResponse
       */
      const imageSecureUrl = imageData.secure_url;

      //houseData just to tweak the data here to have the props of createHouse mutation
      const { data: houseData } = await createHouse({
        variables: {
          input: {
            address: data.address,
            image: imageSecureUrl,
            coordinates: {
              latitude: data.latitude,
              longitude: data.longitude,
            },
            bedrooms: parseInt(data.bedrooms, 10), //parse string to int base 10
          },
        },
      });

      if (houseData?.createHouse) {
        // console.log("houseData", data);
        router.push(`/houses/${houseData.createHouse.id}`);
      } else {
        throw new Error("Error with mutation"); // this should not get here, considering that errors have been handled before this point
      }
    }
  };

  const onSubmit = (data: IFormData) => {
    setSubmitting(true);
    handleCreate(data);
  };

  return (
    <form className="mx-auto max-w-xl py-4 " onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl">Add A New House</h1>

      <div className="mt-4">
        <label htmlFor="search" className="block">
          Search for your address
        </label>
        <SearchBox
          onSelectAddress={(address, latitude, longitude) => {
            setValue("address", address); //setValue from react-hook-form and not usePlacesAutocomplete
            setValue("latitude", latitude);
            setValue("longitude", longitude);
          }}
          defaultValue=""
        />
        {errors.address && <p> {errors.address.message}</p>}
        {/* WATCH IN ACTION */}
        {/* <h2>{address}</h2> */}
      </div>

      {address ? (
        <>
          <div className="mt-4">
            <label
              htmlFor="image"
              className="p-4 border-dashed border-4 border-gray-600 block cursor-pointer"
            >
              <div className="flex flex-col justify-evenly items-center">
                <FiUploadCloud />
                <p> Click to Upload a file (16: 19)</p>
                <small>PNG, JPG, GIF up to 10MB</small>
              </div>
            </label>

            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              style={{ display: "none" }}
              ref={register({
                validate: (fileList: FileList) => {
                  if (fileList.length === 1) return true;
                  return "Please upload one file";
                },
              })}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if (event?.target?.files?.[0]) {
                  const file = event.target.files[0];
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreviewImage(reader.result as string); //cast to string since we know it's a tpe of string
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            {/* calculation; cos we dontknow what the height could be, but we are rendering based off on the alloted width */}
            {previewImage && (
              <img
                src={previewImage}
                className="mt-4 object-cover"
                style={{ width: "576px", height: `${(9 / 16) * 576}px` }}
              />
            )}

            {errors.image && <p> {errors.image.message} </p>}
          </div>
          <div className="mt-4">
            <label htmlFor="bedrooms" className="block">
              Beds
            </label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              className="p-2"
              ref={register({
                required: "Please enter the number of bedrooms",
                max: { value: 10, message: "Woooah, too big of a house" },
                min: { value: 1, message: "Must have at least 1 bedroom" },
              })}
            />
            {errors.bedrooms && <p> {errors.bedrooms.message} </p>}
          </div>
          <div className="mt-4">
            <button
              className="bg-green-500 hover:bg-green-700 font-bold py-2 px-4 rounded"
              type="submit"
              disabled={submitting}
            >
              Save
            </button>
            <Link href="/">
              <a>Cancel</a>
            </Link>
          </div>
        </>
      ) : null}
    </form>
  );
}
