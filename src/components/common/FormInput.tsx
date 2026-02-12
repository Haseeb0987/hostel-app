import React from "react";
import { UseFormRegister } from "react-hook-form";

interface FormInputProps {
  label: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  options?: { value: string; label: string }[];
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  register,
  error,
  type = "text",
  placeholder,
  required = false,
  disabled = false,
  className = "",
  options,
}) => {
  const inputClassName = `form-control ${error ? "is-invalid" : ""}`;
  const selectClassName = `form-select ${error ? "is-invalid" : ""}`;

  return (
    <div className={`mb-3 ${className}`}>
      <label className="form-label">
        {label}
        {required && <span className="text-danger">*</span>}
      </label>

      {type === "select" && options ? (
        <select
          className={selectClassName}
          {...register(name, {
            required: required ? `${label} is required` : false,
          })}
          disabled={disabled}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          className={inputClassName}
          placeholder={placeholder}
          {...register(name, {
            required: required ? `${label} is required` : false,
          })}
          disabled={disabled}
          rows={3}
        />
      ) : (
        <input
          type={type}
          className={inputClassName}
          placeholder={placeholder}
          {...register(name, {
            required: required ? `${label} is required` : false,
          })}
          disabled={disabled}
        />
      )}

      {error && <div className="invalid-feedback">{error.message}</div>}
    </div>
  );
};
