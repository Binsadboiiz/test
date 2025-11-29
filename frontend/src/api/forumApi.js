const API_URL = import.meta.env.VITE_API_URL;

// LIST THREADS (public)
export default async function fetchThreads({ category = "", q = "" }) {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (q) params.append("q", q);

    const res = await fetch(`${API_URL}?${params.toString()}`);

    if (!res.ok) {
        console.error("fetchThreads error", res.status, res.url);
        throw new Error("Fail to fetch threads");
    }

    return res.json();
}

// THREAD DETAIL (public)
export async function fetchThreadDetail(id) {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch thread details");
    return res.json();
}

// CREATE THREAD (cần auth bằng cookie)
export async function createThread({ title, content, category }) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",          // GỬI COOKIE LÊN
        body: JSON.stringify({ title, content, category }),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to create thread");
    }
    return res.json();
}

// ADD REPLY (cần auth)
export async function addReplyToThread(threadId, content) {
    const res = await fetch(`${API_URL}/${threadId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content }),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to add reply");
    }
    return res.json();
}

// DELETE THREAD (cần auth)
export async function deleteThread(threadId) {
    const res = await fetch(`${API_URL}/${threadId}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete thread");
    }

    return res.json();
}
