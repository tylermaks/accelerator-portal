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
    const [offset, setOffset] = useState(0)
    const [hasMoreData, setHasMoreData] = useState(true)

    const fetchSortFilteredData = async (reset = false) => {
        if (reset) {
            setOffset(0)
            setTableData([])
            setHasMoreData(true)
        }

        if (!hasMoreData) return;

        const data = await getTableData(reset ? 0 : offset, sort, filter);

        if (data.error) {
            console.error(data.error);
            return;
        }

        setOffset(data.offset || null);

        if (reset) {
            setTableData(data.records);
        } else {
            setTableData((prevData) => [...prevData, ...data.records]);
        }

        if (!data.offset) {
            setHasMoreData(false);
        }
        
        return data;
    };

    useEffect(() => {
        fetchSortFilteredData(true)
    }, [sort, filter])

    const appendTableData = (newData) => {
        setTableData((prevData) => [...prevData, ...newData])
    }

    const addCondition = (modalType, fieldValue ) => { 
        if (modalType === "Sort"){ 
            const newSortCondition = {field: fieldValue, criteria:"desc"}
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
            appendTableData,
            tableData,
            hasMoreData 
        }}>
            {children}
        </SortFilterContext.Provider>
    );
};
