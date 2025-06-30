
import React from "react";

interface TextInputProps {
  ParentCss?: string;
  type: string;
  placeholder: string;
  change: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  onClick?: () => void;
  className?: string;
  leadingIcon?: React.ReactNode;
  autocomplete?: string;
  trailingIcon?: React.ReactNode;
}

const TextField3d: React.FC<TextInputProps> = ({
  ParentCss = "",
  className = "",
  type = "text",
  placeholder = "",
  change,
  onClick,
  value,
  leadingIcon,
  trailingIcon,
  autocomplete
}) => {
  return (
    <div className={`relative flex  ${ParentCss} items-center transition-all duration-300 ease-in-out  transform active:scale-90 focus:scale-100`}>
      {leadingIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-red flex pointer-events-none">
          {leadingIcon}
        </div>
      )}
      <input
        autoComplete={autocomplete}
        className={`
          w-full
          p-3
          ${leadingIcon ? "pl-10" : ""}
          ${trailingIcon ? "pr-10" : ""}
          outline-none
          font-semibold
          ${className}

          focus:outline-none
        `}
        type={type}
        placeholder={placeholder}
        onChange={change}
        onClick={onClick}
        value={value}
      />
      {trailingIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 cursor-pointer">
          {trailingIcon}
        </div>
      )}
    </div>
  );
};

export default TextField3d;
