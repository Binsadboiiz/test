import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createThread } from "../api/forumApi";
import "../styles/forum.css";
import HandleErrorAPI from "../utils/handleErrorAPI";

export default function CreateThread() {
    const [state, setState] = useState({
        title: "",
        category: "General",
        content: "",
        loading: false,
        error: ""
    });

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if(!user) {
        alert("Please login to create a thread");
        return;
    }

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setState(prev=> ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(!user) {
            alert("Please login to create a thread");
            return;
        }

        if(!state.title.trim() || !state.content.trim()) {
            setState(prev => ({
                ...prev,
                error: "Tiêu đề và nội dung không được để trống"
            }));
            return;
        }

        try {
            setState(prev => ({
                ...prev,
                loading: true,
                error: ""
            }));

            const data = await createThread({
                title: state.title.trim(),
                content: state.content.trim(),
                category: state.category,
            });

            navigate(`/forum/threads/${data.thread._id}`);
        } catch (error) {
            HandleErrorAPI(error, navigate, "CreateThread.handleSubmit")
            setState(prev => ({
                ...prev,
                loading: false,
                error: error.message || "Không tạo được thread"
            }));
        }
    };

    return(
        <div className="feed-container">
            <div className="detail-top-bar">
                <button type="button" className="link-button" onClick={()=> navigate(-1)}>&larr; Back</button>
            </div>

            <div className="feed-card composer-full-card">
                <div className="post-header">
                    <div className="avatar-circle">
                        {user?.displayname
                        ? user.displayname.charAt(0).toUpperCase()
                        : "G"}
                    </div>
                    <div className="post-header-info">
                        <div className="post-meta">
                            <select value={state.category} onChange={handleChange("category")} className="feed-select inline-select">
                                <option value="General">Chung</option>
                                <option value="Book Discussion">Thảo luận sách</option>
                                <option value="Reviews">Review</option>
                                <option value="Off-topic">Khác</option>
                            </select>
                        </div>
                    </div>
                </div>
                <form className="create-post-form" onSubmit={handleSubmit}>
                    {state.error && (
                        <p className="error-text" style={{marginBottom: "8px"}}>{state.error}</p>
                    )}

                    <input type="text" className="feed-input title-input" placeholder="Tiêu đề bài viết..." value={state.title} onChange={handleChange("title")} />
                    <textarea className="feed-textarea" rows={6} placeholder="Chia sẻ suy nghĩ của bạn...." value={state.content} onChange={handleChange("content")} />
                    <div className="create-post-actions">
                        <button className="btn btn-primary" type="submit" disabled={state.loading}>{state.loading ? "Đang đăng..." : "Đăng bài"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}