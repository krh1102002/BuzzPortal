"use client";
import clsx from "clsx";
import React from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface inputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  disabled?: boolean;
}

const Input: React.FC<inputProps> = ({
  label,
  id,
  type,
  required,
  register,
  errors,
  disabled,
}) => {
  return (
    <div>
      <label
        className="block text-sm font-medium leading-6 text-gray-900"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          autoComplete={id}
          type={type}
          disabled={disabled}
          {...register(id, { required })}
          className={clsx(
            `
          form-input
          block
          w-full
          rounded-md
          border-0
          py-1.5
          text-gray-900
          shadow-sm
          ring-1
          ring-inset
          placeholder:text-gray-400
          focus:ring-2
          focus:ring-sky-600
          sm:text-sm
          sm:leading-6`,
            errors[id] && "focus:ring-rose-500",
            disabled && "opacity-50 cursor-default"
          )}
        />
      </div>
    </div>
  );
};

export default Input;
