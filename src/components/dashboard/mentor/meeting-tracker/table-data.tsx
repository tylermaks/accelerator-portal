import { createClient } from '@/utils/supabase/server'
import { cookies, headers } from 'next/headers'

const API_KEY = process.env.AIRTABLE_API_KEY
const BASE_ID = process.env.BASE_ID
const TABLE_ID = process.env.MEETING_TABLE_ID
const VIEW_ID = process.env.MEETING_VIEW_ID

interface Params {
    [key: string]: string | undefined;
}
  
export default async function getTableData( 
    offset: string | null = null,
    params: Params | null = null,
) {
    const supabase = await createClient();
    const { data: user, error } = await supabase.auth.getUser();

    if (error) {
        console.error('Error fetching user:', error);
        return { error: 'Error fetching user', status: 500 }
    }

    if (!user) {
        return { error: "No user found" , status: 401 };
    }

    if(user) {
        const userEmail = user.user.email

        try{
            let filterFormula = `AND({email} = '${userEmail}')`; // change this in production
        
            if (params?.filter) {
                const decodedFilter = decodeURIComponent(params.filter);
                const filterArray = typeof decodedFilter === "string" ? JSON.parse(decodedFilter) : decodedFilter; //parse param

                if (filterArray.length > 0) {
                    filterFormula = `AND({email} = '${userEmail}'`;
                    
                    filterArray.forEach((item: { field: string; value: string }) => {
                        filterFormula += `, FIND('${item.value}', {${item.field}}) > 0`;
                    });
                    
                    filterFormula += ")";
                }
            }

            let encodedFilter = encodeURIComponent(filterFormula);
            let sortField = encodeURIComponent(`sort[0][field]`) + `=date`;
            let sortDirection = encodeURIComponent(`sort[0][direction]`) + `=desc`;
            let sortQuery = !params?.sort || params.sort.length === 0 
                ? `${sortField}&${sortDirection}` 
                : "";

            if (params?.sort) {
                const decodedSort = decodeURIComponent(params.sort);
                const sortArray = typeof decodedSort === "string" ? JSON.parse(decodedSort) : decodedSort; //parse param
                let index = 1

                if (sortArray && sortArray.length > 0) {
                sortArray.forEach((item: { field: string; value: string }) => {
                    let sortField = encodeURIComponent(`sort[${index}][field]`) + `=${item.field}`;
                    let sortDirection = encodeURIComponent(`sort[${index}][direction]`) + `=${item.value}`;
                    sortQuery += `&${sortField}&${sortDirection}`; 
                    index++
                });
                }
            }

            const urlBase = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?filterByFormula=${encodedFilter}&pageSize=25&${sortQuery}&view=${VIEW_ID}`
            const urlOffset = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?offset=${offset}`
            const paginatedUrl = offset ? urlOffset : urlBase
            const response = await fetch(paginatedUrl, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            let records = await response.json()
            return records
            } catch (error) {
                console.error('Error fetching user:', error);
            }
    }
}
