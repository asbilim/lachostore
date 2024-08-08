"use client";
import StoreRegistration from "./register";
import { StepsProvider } from "react-step-builder";

export default function MainRegistration({ texts }) {
  return (
    <StepsProvider>
      <div className="flex w-full my-24 flex-col gap-12 px-4">
        <div className="flex items-center justify-center">
          <h2 className="text-2xl font-bold">
            Start your journey with lachofit
          </h2>
        </div>
        <StoreRegistration staticText={texts} />
      </div>
    </StepsProvider>
  );
}
