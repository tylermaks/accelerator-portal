"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

type SelectProps = {
    label: string;
    id: string;
    name: string;
    data: string[];
    searchable?: boolean;
}

export default function Select(
    {label, id, name, data, searchable = false } : SelectProps
) {
    const [dropdown, setDropdown] = useState(false)
    const [search, setSearch] = useState("")
    const [filteredList, setFilteredList] = useState<any[]>([])
    const [currentOption, setCurrentOption] = useState<string>("")
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null)

    
    const toggleDropdown = () => { 
        setDropdown(!dropdown)
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdown(false);
        }
    };

    const updateOption = (item: string) => {
        console.log("item", item, typeof(item))

        setCurrentOption(item)
        setDropdown(false)
        if(selectRef.current){
            selectRef.current.value = item
        }
    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => { 
        const newValue = event.target.value
        setSearch(newValue)
    }

    const filterCompanyList = () => { 
        const filteredOptions = data && data.filter(item => {
            return item.toLowerCase().includes(search.toLowerCase())
        })
        
        setFilteredList(filteredOptions)
    }

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
    }, [search])

   
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
                        {filteredList?.length > 0 ? (
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
            >
                {data?.map((option, index) => {
                    return(
                        <option key={index} value={option}>
                            {option}
                        </option>
                    )
                })}
            </select>
        </div>
    );
}

