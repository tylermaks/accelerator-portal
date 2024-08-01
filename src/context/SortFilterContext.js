"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getTableData } from '@/lib/actions'

const SortFilterContext = createContext()

export function useSortFilter() {
  return useContext(SortFilterContext)
}

export const SortFilterProvider = ({ children }) => {
    const [sort, setSort] = useState([])
    const [filter, setFilter] = useState([])
    const [tableData, setTableData] = useState([])
    const [offset, setOffset] = useState(null)
    const [hasMoreData, setHasMoreData] = useState(true)
    const [resetState, setResetState] = useState(false)

    const fetchSortFilteredData = async (reset = false) => {
        if (reset) {
            setOffset(null)
            setTableData([])
            setHasMoreData(true)
        }

        if (!hasMoreData) return;

        const data = await getTableData(offset, sort, filter);

        if (data.error) {
            console.error(data.error);
            return;
        }

        if (data.offset) {
            setOffset(data.offset);
        } else {
            setHasMoreData(false);
        }

        if (reset) {
            setTableData(data.records);
        } else {
            setTableData((prevData) => [...prevData, ...data.records]);
        }
    };

    const toggleState = () => {
        setResetState(prevState => !prevState)
    }

    useEffect(() => {
        setOffset(null)
        toggleState()
    }, [sort, filter])


    useEffect(() => {
        fetchSortFilteredData(true)
    }, [resetState])


    const addCondition = (modalType, fieldValue ) => { 
        if (modalType === "Sort"){ 
            const newSortCondition = {field: fieldValue, criteria: "asc"}
            setSort(prevData => [...prevData, newSortCondition])
        } else { 
            const newFilterCondition = {field: fieldValue, criteria:""}
            setFilter(prevData => [...prevData, newFilterCondition])
        }
    }

    const removeCondition = (modalType, field) => {
        if(modalType === "sort"){
            setSort(prevSort => prevSort.filter(item => item.field !== field))
        } else { 
            setFilter(prevFilter => prevFilter.filter( item => item.field !== field))
        }  
    }

    const updateCondition = (id, condition, field, value) => {
        let updatedItems
        console.log("value", value, "field", field)
        if(condition === "Sort"){
            updatedItems = [...sort]
            updatedItems[id] = {...updatedItems[id], field: field, criteria: value}
            setSort(updatedItems)
        } else { 
            updatedItems = [...filter]
            updatedItems[id] = {...updatedItems[id], field: field, criteria: value}
            setFilter(updatedItems)
        }
    }

    const clearConditions = (modalType) => {
        if(modalType === "Sort"){
            setSort([])
        } else {
            setFilter([])
        }
    }

    return (
        <SortFilterContext.Provider value={{ 
            sort, 
            filter, 
            addCondition, 
            removeCondition, 
            updateCondition, 
            clearConditions, 
            fetchSortFilteredData,
            tableData,
            hasMoreData 
        }}>
            {children}
        </SortFilterContext.Provider>
    );
};
