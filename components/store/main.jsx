"use client";
import { Link } from "../navigation";
import StoreRegistration from "./register";
import { StepsProvider } from "react-step-builder";

export default function MainRegistration({ texts }) {
  return (
    <StepsProvider>
      <div className="flex w-full my-24 flex-col gap-12 px-4">
        <div className="flex flex-col gap-2 items-center justify-center">
          <h2 className="text-2xl font-bold">
            Start your journey with lachofit
          </h2>
          <p className="text-center">
            please make sure you read and accept our{" "}
            <Link href="/terms" target="_blank" className="text-primary">
              terms and policies
            </Link>
          </p>
        </div>
        <StoreRegistration staticText={texts} />
      </div>
    </StepsProvider>
  );
}
