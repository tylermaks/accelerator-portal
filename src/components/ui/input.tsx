"use client";

import React from "react";
import { z } from "zod";
import DOMPurify from "dompurify";
import Image from "next/image";

const InputSchema = z.object({
  value: z.string().min(0, "This field is required"),
});

type InputProps = {
  label: string;
  type: string;
  id: string;
  name: string;
  setFormState?: (value: string) => void;
  prepopulate?: string;
  isRequired?: boolean;
  resetKey?: number;
};

const Input: React.FC<InputProps> = ({
  label,
  type,
  id,
  name,
  setFormState,
  prepopulate,
  isRequired = false,
  resetKey,
}) => {
  const [error, ReactsetError] = React.useState("");
  const [isPassword, setIsPassword] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = DOMPurify.sanitize(e.target.value);
    const result = InputSchema.safeParse({ value: sanitizedValue });

    if (!result.success) {
      ReactsetError(result.error.errors[0].message);
    } else {
      ReactsetError("");
      setFormState && setFormState(sanitizedValue);
    }
  };

  const togglePassword = () => {
    setIsPassword(!isPassword);
  };

  return (
    <div className="w-full relative">
      <label htmlFor={id} className="block mb-1 text-xs text-gray-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={isPassword ? (type === "password" ? "text" : type) : type}
        value={prepopulate || ""}
        onChange={handleChange}
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        required={isRequired}
        autoComplete="off"
        min="0"
        step="0.01"
      />
      {type === "password" && (
        <Image
          className="absolute right-3 top-[45%] bottom-[55%] cursor-pointer"
          src="/images/show-icon.svg"
          alt="Show password"
          width={23}
          height={23}
          onClick={togglePassword}
        />
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;