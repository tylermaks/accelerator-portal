export default function Logout() {
    return(
        <form action="/auth/logout" method="POST">
            <button type="submit">Logout</button>
        </form>
    ) 
}