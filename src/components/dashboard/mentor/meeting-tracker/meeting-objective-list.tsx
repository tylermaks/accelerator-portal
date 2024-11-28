type MeetingObjectiveProps = { 
    fields: {
        Name: number, 
        'Meeting Objective': string
    }
}

export default async function getMeetingObjectiveList() { 
    const url = `https://api.airtable.com/v0/${process.env.BASE_ID}/${process.env.MEETING_OBJECTIVE_TABLE_ID}?sort[0][field]=Name&sort[0][direction]=asc`
    const res = await fetch(url, { 
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }, 
      cache: "force-cache"
    })
  
    const meetingObjective = await res.json();
    const meetingObjectiveList = meetingObjective?.records?.map((option: MeetingObjectiveProps) => { return option.fields['Meeting Objective']})  
    return meetingObjectiveList
}