import { useEffect, useState } from "react"
import HandleErrorAPI from "../utils/handleErrorAPI";

const API_URL = "http://localhost:3000/api/books";

export default function BooksManagement() {
    
    const [book, setBook] = useState([]);
    const [loading, setLoading] = useState(true);
    const [booksByPublisher, setBooksByPublisher] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const loadBooks = async () => {
        setLoading(true);
            try {
                const booksRes = await fetch(`${API_URL}`, {
                    method: "GET",
                    credentials: "include"
                })
                const booksData = await booksRes.json();

            } catch (error) {
                
            }
        }
    })

    return( 
        <>
        </>
    )
}