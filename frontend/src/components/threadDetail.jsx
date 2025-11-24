import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import  { addReplyToThread, deleteThread, fetchThreadDetail }  from "../api/forumApi.js";
import HandleErrorAPI from "../utils/handleErrorAPI";
import "../styles/forum.css";

export default function ThreadDetail() {
    const {id} = useParams();

    const navigate = useNavigate();

    const [state, setState] = useState({
        thread: null,
        posts: [],
        loading: false,
        error: "",
        replyContent: "",
        replyLoading: false,
        actionError: "",
    });

    const user = JSON.parse(localStorage.getItem("user") || "null");

    const isAdmin  = user?.roles?.includes("admin");
    const isAuthor = state.thread && user && state.thread.author?._id === user._id;

    useEffect(()=> {
        const loadThread = async () => {
            try {
                setState(prev => ({
                    ...prev,
                    loading: true,
                    error: ""
                }));

                const data = await fetchThreadDetail(id);

                setState(prev => ({
                    ...prev, 
                    thread: data.thread,
                    posts: data.posts || [],
                    loading: false
                }));
            } catch (error) {
                HandleErrorAPI(error, navigate, "ThreadDetail fetchThreadDetail");
                setState(prev => ({
                    ...prev,
                    loading: false,
                    error: error.message || "Không load được thread"
                }));
            }
        };
        loadThread();
    }, [id, navigate]);

    const handleSubmitReply = async (e) => {
        e.preventDefault();

        if(!user) {
            alert("Please login to reply");
            return;
        }

        if(!state.replyContent.trim()) return;

        try {
            setState(prev => ({
                ...prev,
                replyLoading: true,
                actionError: "",
            }));

            const data = await addReplyToThread(state.thread._id, state.replyContent.trim());

            setState(prev => ({
                ...prev,
                posts: [...prev.posts, data.posts],
                replyContent: "",
                replyLoading: false,
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                replyLoading: false,
                actionError: error.message || "Không gửi được reply"
            }));
        }
    };

    const handleDeleteThread = async () => {
        if(!window.confirm("Are you sure you want to delete this thread?")) return;

        try {
            setState(prev => ({
                ...prev,
                actionError: ""
            }));

            await deleteThread(id);
            navigate("/forum");
        } catch (error) {
            setState(prev => ({
                ...prev, 
                actionError: error.message || "Không xóa được thread"
            }));
        }
    };

        if (state.loading) return <p>Loading thread...</p>;
        if (state.error) return <p className="error-text">{state.error}</p>;
        if (!state.thread) return <p>Thread not found.</p>

        const {thread, posts} = state;

        return (
            <div className="feed-container detail-container">
                <div className="detail-top-bar">
                    <button type="button" className="link-button" onClick={()=> navigate(-1)}>&larr; Back</button>
                    <Link className="link-button" to={`/forum`}>Back to Forum</Link>
                </div>

                {/* Bài post chính */}
                <div className="feed-card post-card large-post">
                    <div className="post-header">
                        <div className="avatar-circle">
                            {thread.author?.displayname ? thread.author.displayname.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="post-header-info">
                            <div className="post-author">
                                {thread.author?.displayname || "Unknown"}
                            </div>
                            <div className="post-meta">
                                <span>{thread.createAt ? new Date(thread.createAt).toLocaleString() : ""}</span>
                                {thread.category && (
                                    <>
                                    <span className="dot">•</span>
                                    <span className="post-tag">{thread.category}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {(isAdmin || isAuthor) && (
                            <button type="button" className="btn btn-danger btn-small" onClick={handleDeleteThread}>Delete</button>
                        )}
                    </div>

                    <div className="post-body">
                        <h2 className="post-title">{thread.title}</h2>
                        <p className="post-content-full">{thread.content}</p>
                    </div>

                    <div className="post-footer">
                        <div className="post-stats">
                            <span>{thread.views || 0} Views</span>
                            <span className="dot">•</span>
                            <span>{posts.length} Comments</span>
                        </div>
                    </div>
                </div>

                {/* Chỗ comments */}
                <div className="comments-section feed-card">
                    <h3 className="comments-title"> Comment</h3>
                    {state.actionError && (
                        <p className="error-text">{state.actionError}</p>
                    )}

                    {/* ô nhập comment */}
                    <form className="comment-form" onSubmit={handleSubmitReply}>
                        <div className="comment-form-top">
                            <div className="avatar-circle small-avatar">
                                {user?.displayname
                                     ? user.displayname.charAt(0).toUpperCase()
                                     : "G"}
                            </div>

                            <input type="text" className="comment-input" 
                            placeholder={user 
                            ? "Viết bình luận của bạn" 
                            : "Đăng nhập để bình luận..."} 
                            value={state.replyContent} 
                            onChange={(e)=> 
                            setState(prev => ({
                                ...prev,
                                replyContent: e.target.value
                            }))} 
                            disabled={!user || state.replyLoading}/>
                        </div>
                        <div className="comment-form-actions">
                            <button type="submit" className="btn btn-primary btn-small"
                            disabled={!user || state.replyLoading || !state.replyContent.trim()} >
                                {state.replyLoading ? "Sending...." : "Send"}
                            </button>
                        </div>
                    </form>

                    {/* List comments */}
                    <div className="comments-list">
                        {posts.length === 0 && (
                            <p className="feed-status">Chưa có comment nào.</p>
                        )}

                        {posts.map((post) => (
                            <div className="comment-item" key={post._id}>
                                <div className="avatar-circle small-avatar">{post.author?.displayname ? post.author.displayname.charAt(0).toUpperCase() : "U"}</div>
                                    <div className="comment-content">
                                        <div className="comment-header">
                                            <span className="comment-author">{post.author?.displayname || "Unknown"}</span>
                                            <span className="comment-time">{post.createAt ? new Date(post.createAt).toLocaleString() : ""}</span>
                                        </div>
                                        <p className="comment-text">{post.content}</p>
                                    </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
}