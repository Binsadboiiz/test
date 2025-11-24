const API_URL = "http://localhost:3000/api/forum";

function  getAuthHeader() {
    const token = localStorage.getItem("token");
    return token ? {Authorization : `Bearer ${token}`} : {};
};

export default async function fetchThreads({category = "", q = ""}) {
    const params = new URLSearchParams();
    // params.append("page", page);
    // params.append("limit", limit);

    if(category) params.append("category", category);
    if(q) params.append("q", q);

    const res = await fetch(`${API_URL}/threads?` + params.toString());

    if(!res.ok) throw new Error("Fail to fetch threads");

    return res.json();
};

export async function fetchThreadDetail(id) {
    const res = await fetch(`${API_URL}/threads/${id}`);
    if(!res.ok) throw new Error("Failed to fetch thread details");

    return res.json();
}

export async function createThread({title, content, category }) {
    const res = await fetch(`${API_URL}/threads`, {
        method: "POST",
        headers: {"Content-Type" : "application/json", ...getAuthHeader()},
        body: JSON.stringify({title, content, category}),
    });

    if(!res.ok) {
        const data = await res.json().catch(()=> ({}));
        throw new Error(data.message || "Failed to create thread");
    }
    return res.json();
};

export async function addReplyToThread(threadId, content) {
    const res = await fetch(`${API_URL}/threads/${threadId}/replies`, {
        method: "POST",
        headers: {"Content-Type" : "application/json", ...getAuthHeader()},
        body: JSON.stringify({content}),
    });

    if(!res.ok) {
        const data = await res.json().catch(()=> ({}));
        throw new Error(data.message || "Failed to add reply");
    }
    return res.json();
};

export async function deleteThread(threadId) {
    const res = await fetch(`${API_URL}/threads/${threadId}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeader(),
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to delete thread");
  }

  return res.json();
};