import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchThreads from "../api/forumApi.js";
import HandleErrorAPI from "../utils/handleErrorAPI.js";
import "../styles/forum.css";

export default function ThreadList() {
    const [state, setState] = useState({
        threads: [],
        category: "",
        q: "",
        loading: false,
        error: "",
    });

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    
    useEffect(()=> {
        const loadThreads = async () => {
            try {
                setState(prev => ({...prev, loading: true, error: ""}));

                const data = await fetchThreads({
                    category: state.category,
                    q: state.q,
                });

                setState(prev => ({
                    ...prev, 
                    threads: data.threads || [],
                    loading: false,
                }));
            } catch (error) {
                HandleErrorAPI(error, navigate, "ThreadList fetchThreads");

                setState(prev => ({
                    ...prev,
                    loading: false,
                    error: error.message || "Không load được threads",
                }));
            }
        };
        loadThreads();
    }, [state.category, state.q, navigate]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setState(prev => ({
            ...prev,
            search: prev.q.trim(),
        }));
    };

    const handleChangeCategory = (e) => {
        const value =e.target.value;
        setState(prev => ({...prev, category: value}));
    };

    const handleChangeSearch = (e) => {
        const value = e.target.value;
        setState(prev => ({...prev, q: value}));
    };
    
    const handleOpenThread = (id) => {
        navigate(`/forum/threads/${id}`);
    }

    const handleOpenCreate = () => {
        if(!user) {
            alert("Please login to create a thread");
            return;
        }
        navigate('/forum/threads/new');
    }

    return (
        <div className="feed-container">
            {/* Composer */}
            <div className="feed-card composer-card" onClick={handleOpenCreate}>
                <div className="composer-left">
                    <div className="avatar-circle">
                        {user?.displayname ? user.displayname.charAt(0).toUpperCase() : "G"}
                    </div>
                </div>
                <div className="composer-right">
                    <div className="composer-placeholder">
                        {user ? `${user.displayname}, What are you thinking?` : "Đăng nhập để chia sẻ cảm nghĩ của bạn...."}
                    </div>
                </div>
            </div>

            {/* Filter + search */}
            <form className="feed-filters" onSubmit={handleSearchSubmit}>
                <select className="feed-select" value={state.category} onChange={handleChangeCategory}>
                    <option value="">All</option>
                    <option value="General">General</option>
                    <option value="Book Discussion">Book Discussion</option>
                    <option value="Reviews">Reviews</option>
                    <option value="Off-topic">Off-topic</option>
                </select>

                <input type="text" className="feed-input" placeholder="Tìm kiếm theo tiêu đề..."  value={state.q} onChange={handleChangeSearch}/>
                <button type="submit" className="btn btn-secondary">Search</button>
            </form>

            {state.loading && <p>Loading threads...</p>}
            {state.error && <p className="error-text">{state.error}</p>}
            {!state.loading && !state.error && state.threads.length === 0 && <p>No threads found.</p>}
            
            {/* List thread */}

            {!state.loading && 
            state.threads.length > 0 && 
            state.threads.map((thread) => (
                <div className="feed-card post-card" onClick={()=> handleOpenThread(thread._id)}>
                    <div className="post-header">
                        <div className="avatar-circle">{thread.author?.displayname ?
                            thread.author.displayname.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="post-header-info">
                            <div className="post-author">
                                {thread.author?.displayname || "Unknown"}
                            </div>
                            <div className="post-meta">
                                <span>
                                    {thread.createAt ? new Date(thread.createAt).toLocaleString() : ""}
                                </span>
                                {thread.category && (
                                    <>
                                        <span className="dot">•</span>
                                        <span className="post-tag">{thread.category}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="post-body">
                        <h3 className="post-title">{thread.title}</h3>
                        {thread.content && (
                            <p className="post-content-preview">
                                {thread.content.length > 180 ? thread.content.slice(0, 180 + "...") : thread.content}
                            </p>
                        )}
                    </div>

                    <div className="post-footer">
                        <div className="post-stats">
                            <span>{thread.view || 0} Views</span>
                            <span className="dot">•</span>
                            <span>{thread.repliesCount || 0} Comments</span>
                        </div>
                        <div className="post-actions">
                            <button type="button" className="link-button" onClick={(e)=> {
                                e.stopPropagation();
                                handleOpenThread(thread._id);
                            }}>View Detail 
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}