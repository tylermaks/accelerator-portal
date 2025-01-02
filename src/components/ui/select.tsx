"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

type SelectProps = {
  label: string;
  id: string;
  name: string;
  prepopulate?: string;
  optionList: string[];
  isRequired?: boolean;
  isSearchable?: boolean;
  setFormState?: (currentOption: string) => void;
  closeDropdown?: (currentOption: string) => void;
};

const Select: React.FC<SelectProps> = ({
  label,
  id,
  name,
  prepopulate,
  optionList,
  setFormState,
  closeDropdown,
  isRequired = false,
  isSearchable = false,
}) => {
  const [dropdown, setDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredList, setFilteredList] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  // Toggle dropdown visibility
  const toggleDropdown = () => setDropdown(!dropdown);

  // Handle click outside of the dropdown
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdown(false);
    }
  }, []);

  // Update the selected option
  const updateOption = useCallback(
    (item: string) => {
      setFormState?.(item);
      setDropdown(false);
      setSearch("");
      closeDropdown && closeDropdown(item);

      if (selectRef.current) selectRef.current.value = item;
    },
    [setFormState, closeDropdown]
  );

  // Update search value
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  // Update the search list based on search value
  const filterCompanyList = useCallback(() => {
    const searchResults = optionList?.filter((item) =>
      item.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredList(searchResults);
  }, [search, optionList]);

  // Run filterCompanyList when callback is triggered
  useEffect(() => {
    filterCompanyList();
  }, [filterCompanyList]);

  // Add and remove event listener for clicks outside dropdown
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  // Focus input when dropdown opens
  useEffect(() => {
    if (dropdown && inputRef.current) {
      inputRef.current.focus();
    }
  }, [dropdown]);

  const selectClass =
    "cursor-pointer flex flex-row justify-between p-2.5 border border-gray-300 rounded-lg";
  const dropdownClass = dropdown
    ? "max-h-64 bg-gray-50 px-1 overflow-scroll absolute top-5 left-0 right-0 border border-2 border-blue-700 rounded-lg z-10"
    : "hidden";
  const dropdownOptionClass =
    "p-2 bg-gray-50 text-fsGray cursor-pointer text-sm hover:bg-blue-400 hover:text-white rounded-md";

  return (
    <div className="relative">
      <label htmlFor={id} className="block mb-1 text-xs text-fsGray">
        {label}
      </label>

      <div className={selectClass} onClick={toggleDropdown}>
        <p className="text-sm mb-0">{prepopulate}</p>
        <Image
          src={"/images/chevron-down-icon.svg"}
          alt={"chevron"}
          height={20}
          width={20}
        />
      </div>

      {dropdown && (
        <div ref={dropdownRef} className={dropdownClass}>
          {isSearchable && (
            <input
              ref={inputRef}
              className="w-full p-2.5 text-sm text-fsGray bg-gray-50 focus:outline-none"
              onChange={handleSearch}
              type="text"
              name="companySearch"
              id="companySearch"
              placeholder={`Search ${label}`}
            />
          )}

          <div aria-hidden="true">
            {filteredList && filteredList.length > 0 ? (
              filteredList.map((item: string, index: number) => (
                <div
                  key={index}
                  onClick={() => updateOption(item)}
                  className={dropdownOptionClass}
                >
                  <p className="mb-0">{item}</p>
                </div>
              ))
            ) : (
              <div className={dropdownOptionClass}>
                <p>No results found</p>
              </div>
            )}
          </div>
        </div>
      )}

      <select
        ref={selectRef}
        id={id}
        name={name}
        className=" hidden block py-2.5 px-1 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        required={isRequired}
        value={prepopulate || ""} // Add this line to control the select value
        onChange={(e) => updateOption(e.target.value)} // Add this line to handle direct select changes
      >
        <option value="" disabled>
          Select
        </option>
        {optionList &&
          optionList?.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
      </select>
    </div>
  );
};

export default Select;