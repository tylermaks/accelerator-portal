"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"

type TableButtonProps = {
    text: string
    icon: string
}

export default function SortFilterButton({ text, icon }: TableButtonProps) {
    const [showModal, setShowModal] = useState(false);
    const [showSubMenu, setShowSubMenu] = useState(false);
    const [conditions, setConditions] = useState<string[]>([]);
    const [sortFilterOptions, setSortFilterOptions] = useState<string[]>(["Date", "Company Name", "Duration", "Support Type"]);
    const sortFilterModal = useRef<HTMLDivElement>(null);

    // const sortFilterOptions = ["Date", "Company Name", "Duration", "Support Type"]; // Add this

    const toggleModal = () => {
        setShowModal(!showModal);
    }

    const toggleSubMenu = () => {
        setShowSubMenu(!showSubMenu);
    }

    const addCondition = (condition: string) => {
        setConditions([...conditions, condition]);
        setSortFilterOptions(sortFilterOptions.filter((option) => option !== condition));
        toggleSubMenu();
    }

    const removeCondition = () => {
        setConditions([])
        setSortFilterOptions(["Date", "Company Name", "Duration", "Support Type"]);
    }

    
    const handleClickOutside = (event: MouseEvent) => {
        if (sortFilterModal.current && !sortFilterModal.current.contains(event.target as Node)) {
            setShowModal(false);
            setShowSubMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const clickButtonClass = showModal ? "bg-gray-200" : ""

    return (
        <div className='relative'>
            <div onClick={toggleModal} className={`${clickButtonClass} hover:bg-gray-200 py-1.5 px-2 flex items-center gap-1 cursor-pointer rounded-lg mb-1`}>
                <Image
                    src={icon === "sort" ? "/images/sort-icon.svg" : "/images/filter-icon.svg"}
                    alt="edit"
                    width={20}
                    height={20}
                />
                <p className="text-fsGray text-sm">{text}</p>
            </div>

            {
                showModal &&
                <div ref={sortFilterModal} className="absolute w-80 bg-gray-50 border border-gray-200 shadow-sm rounded z-10">
                    <div className="border-b border-gray-300">
                        <p className="text-fsGray text-xs p-3">{text} by</p>
                    </div>

                    {
                        conditions.length > 0 &&
                        <div className="py-4 px-10 border-b border-gray-300"> 
                            {
                                conditions.map((condition, index) => (
                                    <p
                                        key={index}
                                        className="text-fsGray text-sm py-1 px-2"
                                    >
                                        {condition}
                                    </p>
                                ))
                            }
                        </div>
                    }
                 
                    <div className="relative flex justify-between p-2">
                        <p 
                            className="text-fsGray text-xs py-1 px-2 hover:bg-gray-200 rounded-lg cursor-pointer"
                            onClick={toggleSubMenu}
                        >
                            + Add {text}
                        </p>
                        <p 
                            className="text-fsGray text-xs py-1 px-2 cursor-pointer" 
                            onClick={removeCondition}
                        >
                            Clear All
                        </p>
                        {
                            showSubMenu &&
                            <div className="absolute flex flex-col gap-2 w-60 top-8 left-2 bg-gray-50 border border-gray-200 p-2 shadow-sm rounded z-10">
                            {sortFilterOptions.map((option, index) => (
                                <p
                                    key={index}
                                    className="text-fsGray text-sm p-1 hover:bg-gray-200 rounded cursor-pointer"
                                    onClick={() => addCondition(option)}
                                >
                                    {option}
                                </p>
                            ))}
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    )
}
