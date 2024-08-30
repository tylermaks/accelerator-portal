import PageHeader from "@/components/ui/page-header";
import TableWrapper from "@/components/dashboard/mentor/table-wrapper";
import { createClient } from "@/utils/supabase/server";
import { getTableData } from "@/lib/meeting-actions";


async function getSupportTypeList() { 
  const url = `https://api.airtable.com/v0/${process.env.BASE_ID}/${process.env.SUPPORT_TYPE_TABLE_ID}?sort[0][field]=Name&sort[0][direction]=asc`
  const res = await fetch(url, { 
    headers: {
      'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    }, 
    cache: "force-cache"
  })

  const supportTypeList = await res.json();
  return supportTypeList
}

async function getCompanyList(){ 
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();

  if(user){ 
      let allRecords: any[] = [];
      let offset = null;

      do{ 
          const url = `https://api.airtable.com/v0/${process.env.BASE_ID}/${process.env.COMPANY_TABLE_ID}?view=${process.env.COMPANY_VIEW_ID}&pageSize=50&fields%5B%5D=companyName`
          const paginatedUrl : string = offset ? `${url}&offset=${offset}` : url
          
          const response = await fetch(paginatedUrl, {
              headers: {
                  'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
                  'Content-Type': 'application/json'
              }, 
              cache: "force-cache"
          });

          const data = await response.json()
          allRecords = allRecords.concat(data.records)
          offset = data.offset

      } while (offset)
      
      return allRecords
  } else{ 
    console.error("User not found")
    return []
  }
}


type SupportType = { 
  id: string; 
  createdTime: string; 
  fields: { 
      Name: number;
      'Dropdown Item Name': string;
      'Dropdown Type': string[];
  }
}

type Company =  {
  id: string; 
  createdTime: string; 
  fields: { 
    companyName: string;
  }
}


export default async function MeetingTracker({
    searchParams
  }: {
    searchParams: { [key: string]: string | undefined }
  }) {
    const initialTableData = await getTableData( null, searchParams );

    const supportTypeOptions = await getSupportTypeList()
    const supportTypeList = supportTypeOptions && supportTypeOptions.records.map((item:SupportType ) => item.fields['Dropdown Item Name'])

    const companyListOptions = await getCompanyList()
    const companyList = companyListOptions?.map((item: Company) => item.fields.companyName)


    return (
      <div className="flex flex-col gap-8">
        <PageHeader 
          title="Meeting Tracker"
          subTitle="View your meeting history"
        />
        <TableWrapper 
          tableData={initialTableData}
          supportTypeList={supportTypeList}
          companyList={companyList}
        />      
      </div>
    );
  }