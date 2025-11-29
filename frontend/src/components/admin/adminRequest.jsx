import React, { useEffect, useState } from "react";
import axios from "../../axiosInstance";

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const res = await axios.get("/admin/publisher/requests");
    setRequests(res.data);
  };

  const approve = async (id) => {
    await axios.post(`/admin/publisher/requests/${id}/approve`);
    fetchRequests();
  };

  const reject = async (id) => {
    await axios.post(`/admin/publisher/requests/${id}/reject`);
    fetchRequests();
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Yêu cầu trở thành Publisher</h1>

      <table className="w-full border">
        <thead>
          <tr className="border bg-gray-200">
            <th className="p-2">User</th>
            <th className="p-2">Email</th>
            <th className="p-2">Publisher Info</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((rq) => (
            <tr key={rq._id} className="border">
              <td className="p-2">{rq.userId?.username}</td>
              <td className="p-2">{rq.userId?.email}</td>
              <td className="p-2">
                <b>{rq.pubName}</b><br />
                {rq.pubAddress}<br />
                {rq.pubPhone}<br />
                {rq.pubEmail}<br />
                {rq.pubDescription}
              </td>
              <td className="p-2 flex gap-2">
                <button 
                  className="bg-green-500 text-white px-3 py-1"
                  onClick={() => approve(rq._id)}
                >
                    Approve
                </button>
                <button 
                  className="bg-red-500 text-white px-3 py-1"
                  onClick={() => reject(rq._id)}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
