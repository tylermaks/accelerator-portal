"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDebounce } from "use-debounce"
import Image from "next/image"
// import { useSortFilter } from "@/context/SortFilterContext"

type TableButtonProps = {
    text: string
    icon: string
}

type SortFilterOption = {
    label: string;
    value: string;
};
  
type InitialOptionsState = {
    sortFilterOptions: SortFilterOption[];
};

type Params = {
    field: string;
    value: string;
};

const sortFilterOptions = [
    { label: "Date", value: "Date" },
    { label: "Company Name", value: "companyName" },
    { label: "Duration", value: "duration" },
    { label: "Support Type", value: "supportType" },
];

export default function SortFilterButton({ text, icon }: TableButtonProps) {
    // const { sort, filter, addCondition, removeCondition, updateCondition, clearConditions,} = useSortFilter()
    // const [sortFilterOptions, setSortFilterOptions] = useState<SortFilterOption[]>(initialSortFilterOptions); //Might remove this
    // const conditions = text == "Sort" ? sort : filter;
    
    const router = useRouter();
    const [params, setParams] = useState<Params[]>([]);
    const [value, setValue] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showSubMenu, setShowSubMenu] = useState(false);
    const [query] = useDebounce(value, 500);
    const sortFilterModal = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const queryParams = new URLSearchParams();

        params.forEach((param) => {
            const key = param.field;
            const value = param.value;
            queryParams.append(key, text === "Sort" ? value : query);
        })

        //NEED TO ADD PATH NAME HERE - I THINK THIS WILL HELP WITH OVERWRITING THE URL
        router.push(`?${queryParams.toString()}`);
    }, [params, query, router]);
    
    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const toggleSubMenu = () => {
        setShowSubMenu(!showSubMenu);
    };

    const addParam = (field: string) => {
        const valueType = text === "Sort" ? "asc" : ""
        const newParam = {field: field, value: valueType }
        setParams(prevData => [...prevData, newParam])
        toggleSubMenu();
    }

    const removeParam = (field: string) => {
        setParams(prevData => prevData.filter(item => item.field !== field));
    }

    const updateParam = (id: number, field: string, value: string) => { 
        let updatedItem
        updatedItem = [...params]
        updatedItem[id] = {...updatedItem[id], field: field, value: value}
        setParams(updatedItem)
    }

    const clearParams = () => {
        setParams([])
    }

    // const handleAddCondition = (condition: string) => {
    //     addCondition(text, condition);
    //     toggleSubMenu();
    // };

    // const handleRemoveCondition = (condition: string) => {
    //     removeCondition(text, condition);
    // }

    // const handleUpdateCondition = (id: number, condition: string, field: string, value: string) => {
    //     updateCondition(id, condition, field, value);
    // }

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
    // const activeSortFilter = conditions.length > 0 ? "bg-green-100" : ""
    const active = params.length > 0 ? "bg-green-100" : ""

    return (
        <div className='relative'>
            <div onClick={toggleModal} className={`${clickButtonClass} ${active} hover:bg-gray-200 py-1.5 px-2 flex items-center gap-1 cursor-pointer rounded-lg mb-1`}>
                <Image
                    src={icon === "sort" ? "/images/sort-icon.svg" : "/images/filter-icon.svg"}
                    alt="edit"
                    width={20}
                    height={20}
                />
                <p className="text-fsGray text-sm">{text} {params.length > 0 ? `(${params.length})` : ""}</p>
            </div>

            {
                showModal &&
                <div ref={sortFilterModal} className="absolute w-[500px] bg-gray-50 border border-gray-200 shadow-sm rounded z-10">
                    <div className="border-b border-gray-300">
                        <p className="text-fsGray text-xs p-3">{text} by</p>
                    </div>

                    {
                        params.length > 0 &&
                        <div className="flex gap-4 py-4 px-7 border-b border-gray-300"> 
                            <p className="text-fsGray text-sm mt-2">Where</p>
                            <div className="flex flex-col gap-1.5">
                            {
                                params.map((condition: any, index: number) => (
                                    
                                    <div key={index} className="flex items-center gap-1">
                                        <select 
                                            className="text-fsGray text-sm p-1.5 bg-gray-50 border rounded" 
                                            name="condition-select" 
                                            id="condition-select"
                                            // onChange={(e) => handleUpdateCondition(index, text, e.target.value, condition.criteria)}
                                            onChange={(e) => updateParam(index, text, e.target.value)}
                                            value={condition.field}
                                        >
                                            <option value="date">Date</option>
                                            <option value="companyName">Company Name</option>
                                            <option value="duration">Duration</option>
                                            <option value="supportType">Support Type</option>
                                        </select>
                                        {
                                            text == "Sort" ? (
                                                <select 
                                                    className="text-fsGray text-sm p-1.5 bg-gray-50 border rounded" 
                                                    name="sort-select" 
                                                    id="sort-select"
                                                    // onChange={(e) => handleUpdateCondition(index, text, condition.field, e.target.value)}
                                                    onChange={(e) => updateParam(index, text, e.target.value)}
                                                    value={condition.criteria}
                                                >
                                                    <option value="asc">Ascending</option>
                                                    <option value="desc">Descending</option>
                                                </select>

                                            ) : (
                                                <input 
                                                    type="text" 
                                                    value={value}
                                                    placeholder="Enter a value"
                                                    className="text-fsGray text-sm p-1.5 bg-gray-50 border rounded"
                                                    // onChange={(e) => handleUpdateCondition(index, text, condition.field, e.target.value)}
                                                    onChange={(e) => setValue(e.target.value)}
                                                />
                                            )
                                        }
                                        
                                        <Image 
                                            src="/images/close-icon.svg" 
                                            className="cursor-pointer" 
                                            alt="remove condition"
                                            // onClick={() => handleRemoveCondition(condition.field)}
                                            onClick={() => removeParam(condition.field)} 
                                            width={10} 
                                            height={10}
                                        />
                                    </div>
                                ))
                            }
                            </div>
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
                            onClick={() => clearParams()}
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
                                    onClick={() => addParam(option.value)}
                                >
                                    {option.label}
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