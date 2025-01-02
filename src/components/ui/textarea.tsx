"use client";

import React from "react";
import { z } from "zod";
import DOMPurify from "dompurify";

// Define the schema using Zod
const TextareaSchema = z.object({
  value: z.string().min(0),
});

type TextAreaProps = {
  label: string;
  name: string;
  prepopulate?: string;
  setFormState?: (value: string) => void;
  resetKey?: number;
};

const Textarea: React.FC<TextAreaProps> = ({
  label,
  name,
  prepopulate,
  setFormState,
  resetKey,
}) => {
  const [error, setError] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitizedValue = DOMPurify.sanitize(e.target.value);
    const result = TextareaSchema.safeParse({ value: sanitizedValue });

    if (!result.success) {
      setError(result.error.errors[0].message);
    } else {
      setError("");
      setFormState && setFormState(sanitizedValue);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <label htmlFor={name} className="block mb-1 text-xs text-fsGray">
        {label}
      </label>
      <textarea
        className="w-full resize-none border bg-gray-50 rounded-lg p-2 text-sm text-fsGray h-full"
        name={name}
        id={name}
        value={prepopulate || ""}
        onChange={handleChange}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Textarea;