"use client";

import { useState, useCallback, useMemo } from "react";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import useRentModal from "@/app/hooks/useRentModal";
import useRegister from "@/app/hooks/useRegisterModal";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Button from "../Button";

import CategoryInput from "../inputs/CategoryInput";
import CountrySelect from "../inputs/CountrySelect";

import { categoriesDummy } from "../navbar/Categories";
import dynamic from "next/dynamic";

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const RentModal = () => {
  const router = useRouter();
  const rentModal = useRentModal();

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.CATEGORY);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: "",
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: "",
      price: 1,
      title: "",
      description: "",
    },
  });

  const category = watch("category");
  const location = watch("location");

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [location]
  );

  const setCustomValue = (category: string, value: any) => {
    setValue(category, value, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
  };

  const onBack = () => {
    setStep((val) => val - 1);
  };

  const onNext = () => {
    setStep((val) => val + 1);
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return "Create";
    }

    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }

    return "Back";
  }, [step]);

  const StepPages = (step: STEPS) => {
    switch (step) {
      case STEPS.CATEGORY:
        return (
          <div className="flex flex-col gap-8">
            <Heading
              title="Which of these best describes your place?"
              subtitle="Pick a category"
            />
            <div
              className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-3
              max-h-[50vh]
              overflow-auto
            "
            >
              {categoriesDummy.map((item) => (
                <div key={item.label} className="col-span-1">
                  <CategoryInput
                    onClick={(category) => setCustomValue("category", category)}
                    selected={category === item.label}
                    label={item.label}
                    icon={item.icon}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case STEPS.LOCATION:
        return (
          <div className="flex flex-col gap-8">
            <Heading
              title="Where is your place located?"
              subtitle="Help guests find you!"
            />
            <CountrySelect
              value={location}
              onChange={(value) => setCustomValue("location", value)}
            />
            <Map center={location?.latlng} />
          </div>
        );
      default:
        break;
    }
  };

  return (
    <Modal
      disabled={isLoading}
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={onNext}
      title="AirBnb Your Home"
      actionLabel={actionLabel}
      secondaryLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      body={StepPages(step)}
    />
  );
};

export default RentModal;
