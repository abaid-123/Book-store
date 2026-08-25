import React, { useEffect, useMemo, useState } from "react";
import { fetchUsers, deleteUser } from "../api/auth";

const formatWhen = (value) => {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers()
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
        setError("");
      })
      .catch((err) => {
        setError(err.message || "Could not load users. Restart FastAPI and refresh.");
      })
      .finally(() => setLoading(false));
  }, []);

  const members = useMemo(
    () => users.filter((row) => row.role !== "admin"),
    [users]
  );
  const loggedIn = useMemo(
    () => members.filter((row) => row.lastLogin).length,
    [members]
  );

  const handleDelete = async (row) => {
    if (
      !window.confirm(
        `Delete ${row.email}? This account will no longer be able to sign in.`
      )
    ) {
      return;
    }
    try {
      await deleteUser(row._id);
      setUsers((current) => current.filter((item) => item._id !== row._id));
    } catch (err) {
      alert(err.message || "Could not delete user.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-700">
          Members
        </p>
        <h2 className="text-3xl font-bold text-slate-900 mt-1">Users</h2>
        <p className="text-slate-500 mt-1">
          Remove an account if it should no longer use the store.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Registered users</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{members.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Have logged in</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{loggedIn}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading && <p className="p-8 text-slate-500">Loading users...</p>}
        {error && (
          <p className="m-4 text-red-700 bg-red-50 border border-red-100 rounded-lg p-4">
            {error}
          </p>
        )}
        {!loading && !error && members.length === 0 && (
          <p className="p-8 text-slate-500">No members have signed up yet.</p>
        )}
        {!loading && !error && members.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate-400 bg-slate-50">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Signed up</th>
                  <th className="py-3 px-4">Last login</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((row) => (
                  <tr key={row._id} className="border-t border-slate-100">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {row.displayName}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{row.email}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {formatWhen(row.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {formatWhen(row.lastLogin)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleDelete(row)}
                        className="text-sm font-semibold text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
