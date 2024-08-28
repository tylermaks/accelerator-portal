"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Image from "next/image"
import DOMPurify from "dompurify"
import { z } from "zod"

type SelectProps = {
    label: string;
    id: string;
    name: string;
    prepopulate?: string;
    data: string[];
    isRequired?: boolean;
    searchable?: boolean;
    setFormState?: (currentOption: string) => void;
    closeDropdown?: (currentOption: string) => void;
}

// Define the schema using Zod for allowed options
const allowedOptionsSchema = z.array(z.string());
const InputSchema = z.object({
    value: z.string().min(1, "This field is required"),
  });

export default function Select(
    {label, id, name, prepopulate, data, setFormState, closeDropdown, isRequired = false, searchable = false } : SelectProps
) {
    const [dropdown, setDropdown] = useState(false)
    const [search, setSearch] = useState("")
    const [filteredList, setFilteredList] = useState<string[]>([])
    const [currentOption, setCurrentOption] = useState<string>("")
    const [error, setError] = useState<string>("")
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null)


    // Sanitize and validate the provided options
    useEffect(() => {
        const sanitizedData = data?.map(option => DOMPurify.sanitize(option));
        const resultData = allowedOptionsSchema.safeParse(sanitizedData);

        if (!resultData.success) {
            setError("Invalid options provided");
            setFilteredList([]);
        } else {
            setError("");
            setFilteredList(resultData.data);
        }
        
        const sanitizedPrepopulate = prepopulate ? DOMPurify.sanitize(prepopulate) : "";
        const resultPrepopulate = InputSchema.safeParse({ value: sanitizedPrepopulate });

        if (!resultPrepopulate.success) {
            // Handle the error if prepopulate is invalid
            console.error(resultPrepopulate.error);
            setCurrentOption(""); // Optionally set a default value or handle the error
        } else {
            setCurrentOption(resultPrepopulate.data.value);
        }

    }, [data, prepopulate]);

    const toggleDropdown = () => { 
        setDropdown(!dropdown)
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdown(false);
        }
    };

    const updateOption = (item: string) => {
        setCurrentOption(item)
        setDropdown(false)
        closeDropdown && closeDropdown(item)
      
        if(selectRef.current){
            selectRef.current.value = item
        }
    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => { 
        const newValue = DOMPurify.sanitize(event.target.value);
        setSearch(newValue)
    }


    //FIX THIS HERE - INFINITE LOOP!
    const filterCompanyList = useCallback(() => { 
        const filteredOptions = filteredList.filter(item => 
            item.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredList(filteredOptions)
    },[filteredList, search])

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => { 
        if(dropdown && inputRef.current){ 
            inputRef.current.focus()
        }
    }, [dropdown])

    useEffect(() => { 
        filterCompanyList()
    }, [search, filterCompanyList])

    useEffect(() => { 
        if(data){
            setFilteredList(data)
        }
    }, [data])

    const selectClass = "cursor-pointer flex flex-row justify-between p-2.5 border border-gray-300 rounded-lg"
    const dropdownClass = dropdown ? "max-h-64 bg-gray-50 px-1 overflow-scroll absolute top-5 left-0 right-0 border border-2 border-blue-700 rounded-lg z-10" : "hidden"
    const dropdownOptionClass = "p-2 bg-gray-50 text-fsGray cursor-pointer text-sm hover:bg-blue-400 hover:text-white rounded-md"

    return (
        <div className="relative">
            <label htmlFor={id} className="block mb-1 text-xs text-fsGray">
                {label}
            </label>

            <div className={selectClass} onClick={toggleDropdown}>
                <p className="text-sm">
                    {currentOption}
                </p>
                <Image 
                    src={"/images/chevron-down-icon.svg"} 
                    alt={"chevron"} 
                    height={20} 
                    width={20} 
                />
            </div>

            {dropdown && (
                <div ref={dropdownRef} className={dropdownClass}>
                    {searchable && (
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
                        {filteredList.length > 0 ? (
                            filteredList.map(item => (
                                <div 
                                    key={item} 
                                    onClick={() => updateOption(item)} 
                                    className={dropdownOptionClass} 
                                >
                                    <p>{item}</p>
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
            >
                <option value="" disabled>Select</option>
                {data?.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}
