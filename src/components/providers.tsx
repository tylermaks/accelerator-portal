'use client'

import { SortFilterProvider } from '@/context/SortFilterContext'
import React, { ReactNode } from 'react';

type TableProviderProps ={
    children: ReactNode;
}
const TableProvider: React.FC<TableProviderProps> = ({ children }) => {
    return (
      <SortFilterProvider>
        {children}
      </SortFilterProvider>
    );
  };
  
  export default TableProvider;