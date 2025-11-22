import { useLocation, useNavigate } from "react-router-dom";
import "../styles/error.css";

export default function ErrorPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const errorInfo = location.state?.error || {};
    const msg = errorInfo.message || "Có lỗi, nhưng không rõ chỗ nào:))";
    const status = errorInfo.status || null;
    const from = errorInfo.from || null;

    return (
        <div className="error-page">
            <div className="error-card">
                <h1>Oops !</h1>
                <p className="error-main">{msg}</p>

                {status && (
                    <p className="error-status">
                        Error Code: <span>{status}</span>
                    </p>
                )}

                {from && (
                    <p className="error-from">
                        Location: <span>{from}</span>
                    </p>
                )}

                <div className="error-actions">
                    <button onClick={()=> navigate(-1)}>Back to the previous page</button>
                    <button onClick={()=> navigate("/")}>Back to Home Page</button>
                </div>
            </div>
        </div>
    )
}