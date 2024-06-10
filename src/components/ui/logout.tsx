import { logout } from "@/lib/actions";

export default function Logout() {
    return(
        <form action={logout} method="POST">
            <button type="submit">Logout</button>
        </form>
    ) 
}