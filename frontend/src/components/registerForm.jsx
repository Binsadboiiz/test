import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/registerform.css";

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        comfirmPassword: "",
        displayname: ""
    });

    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        const {name, value} = e.target;
        setFormData(prev=> ({...prev, [name]: value}));
    };
    
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccessMsg("");

        if(!formData.password || !formData.comfirmPassword) {
            setError("Password và Comfirm Password không khớp");
            return;
        }

        if(formData.password.length < 8) {
            setError("Password phải có ít nhất 8 ký tự");
            return;
        }

        if(!formData.username || !formData.email || !formData.password) {
            setError("Vui lòng điền đầy đủ thông tin");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/users/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    displayname: formData.displayname
                })
            });

            const data = await res.json();
            if(!res.ok) throw new Error(data.message || "Đăng ký thất bại");

            setSuccessMsg(data.message || "Đăng ký thành công");
            setFormData({
                username: "",
                email: "",
                password: "",
                comfirmPassword: "",
                displayname: ""
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }
    

    return (
        <div className="register-container">
            <h2 className="register-title">Register</h2>
            {error && <div className="error-box">{error}</div>}
            {successMsg && <div className="success-box">{successMsg}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username: </label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange}/>
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email: </label>
                    <input type="text" name="email" value={formData.email} onChange={handleChange}/>
                </div>

                <div className="form-group">
                    <label htmlFor="displayname">Display Name (Optional): </label>
                    <input type="text" name="displayname" value={formData.displayname} onChange={handleChange}/>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password: </label>
                    <input type="text" name="password" value={formData.password} onChange={handleChange}/>
                </div>

                <div className="form-group">
                    <label htmlFor="comfirmPassword">Comfrim Password: </label>
                    <input type="text" name="comfirmPassword" value={formData.comfirmPassword} onChange={handleChange}/>
                </div>

                <button type="submit" disabled={loading} className="register-btn">{loading ? "Loading..." : "Register"}</button>

                <div className="switch-auth">
                    Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </div>
            </form>
        </div>
    )
}