import UserDeleteButton from "./delete-btn"

type UserProps = { 
    data:  {
        user_id: string,
        first_name: string, 
        last_name: string, 
        user_type: string, 
        company_name: string,
    }[], 
}

export default async function MembersTable( { data } : UserProps) { 
    const headerStyles = "p-3 text-left text-sm font-semibold text-gray-100 bg-teal-md"
    const rowStyles = "p-3 text-sm border-t border-gray-200 text-fsGray"

    return (
        <table className="w-full table table-compact table-auto rounded-md">
            <thead> 
                <tr>
                    <th className={headerStyles}>User Name</th>
                    <th className={headerStyles}>Type</th>
                    <th className={headerStyles}>Company</th>
                    <th className={headerStyles}></th>
                </tr>
            </thead>
            <tbody>
                { 
                   data && data.map(user => (
                    <tr key={user.user_id}>
                        <td data-user-id={`${user.user_id}`} className={rowStyles}>{user.first_name} {user.last_name}</td>
                        <td className={rowStyles}>{user.user_type ? user.user_type : "N/A"}</td>
                        <td className={rowStyles}>{user.company_name ? user.company_name : "N/A"}</td>
                        <td className={rowStyles}>
                            {user.user_type !== "admin" && <UserDeleteButton userID={user.user_id}/>}
                        </td>
                    </tr>
                   ))
                }
            </tbody>
        </table>
    )
}