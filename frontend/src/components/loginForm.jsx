import  React , { useState } from "react";
import "../styles/loginform.css";

export default function LoginForm({onLoginSuccess}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:3000/api/users/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username, password})
            })

            const data = await res.json();
            if(!res.ok) {throw new Error(data.message || "Something went wrong");}

            if(onLoginSuccess) {
                onLoginSuccess(data.user);
            }
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return(
        <div className="login-container">
            <form action="" onSubmit={handleSubmit} className="login-form">
                <h2>Longin</h2>
                <label htmlFor="username">Username or Email:</label>
                <input type="text" name="username" id="username" value={username} autoComplete="username" onChange={(e)=>setUsername(e.target.value)} placeholder="Enter your username or email"/>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" autoComplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter your password"/>
                <button type="submit" disabled={loading}>{loading ? "Loading..." : "Login"}</button>
            </form>
        </div>
    )
}