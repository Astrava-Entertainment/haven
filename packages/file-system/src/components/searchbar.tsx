import React from "react";

interface ISearchBar {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

type Props =  ISearchBar

export const Searchbar: React.FC<Props> = (props) => {
  const { value, onChange, placeholder = "Search..." }  = props;
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="px-2 w-full text-white bg-neutral-800 border border-neutral-600 rounded-lg"
      />
    </div>
  );
};
