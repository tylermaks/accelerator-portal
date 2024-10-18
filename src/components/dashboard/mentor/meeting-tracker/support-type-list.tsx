export default async function getSupportTypeList() { 
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