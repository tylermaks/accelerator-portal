import PageHeader from "@/components/ui/page-header";
import TableWrapper from "@/components/dashboard/mentor/meeting-tracker/table-wrapper"
import getSupportTypeList from "@/components/dashboard/mentor/meeting-tracker/support-type-list";
import getCompanyList from "@/components/dashboard/mentor/meeting-tracker/company-list"
import getTableData from "@/components/dashboard/mentor/meeting-tracker/table-data"
import getMeetingObjectiveList from "@/components/dashboard/mentor/meeting-tracker/meeting-objective-list";

const getProgramOptionsList = async () => { 
  const url = `https://api.airtable.com/v0/${process.env.BASE_ID}/${process.env.PROGRAM_OPTIONS_TABLE_ID}?sort[0][field]=Name&sort[0][direction]=asc`
  const res = await fetch(url, { 
    headers: {
      'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    }, 
    cache: "force-cache"
  })

  type Fields = {
    Name: string;
    program_name: string;
  }

  type ProgramOption = {
      fields: Fields;
  }

  const programData = await res.json();
  const programOptionsList = programData?.records?.map((option: ProgramOption) => { return option.fields.program_name})  
  return programOptionsList
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
    const supportTypeList = supportTypeOptions && supportTypeOptions?.records?.map((item:SupportType ) => item.fields)
    const companyListOptions = await getCompanyList()
    const companyList = companyListOptions?.map((item: Company) => item?.fields.companyName)
    const programOptionsList = await getProgramOptionsList()
    const meetingObjectiveList = await getMeetingObjectiveList()

    return (
      <div className="flex flex-col gap-8 py-10 px-8">
        <PageHeader 
          title="Meeting Tracker"
          subTitle="View your meeting history"
        />
        <TableWrapper 
          tableData={initialTableData}
          supportTypeList={supportTypeList}
          companyList={companyList}
          programList={programOptionsList}
          meetingObjectiveList={meetingObjectiveList}
        />      
      </div>
    );
  }