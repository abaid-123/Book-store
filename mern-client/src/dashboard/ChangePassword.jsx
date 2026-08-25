import React, { useState } from "react";
import { Label, TextInput } from "flowbite-react";
import { changePassword } from "../api/auth";

const ChangePassword = () => {
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setInfo("");
    const currentPassword = event.target.currentPassword.value;
    const newPassword = event.target.newPassword.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }
    if (newPassword === currentPassword) {
      setError("New password must be different from the current password.");
      return;
    }

    setBusy(true);
    try {
      const data = await changePassword(currentPassword, newPassword);
      setInfo(data.message || "Password updated successfully.");
      event.target.reset();
    } catch (err) {
      setError(err.message || "Could not update password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-700">
          Account
        </p>
        <h2 className="text-3xl font-bold text-slate-900 mt-1">Change password</h2>
        <p className="text-slate-500 mt-1">
          Enter your current password. If it matches, the new password is saved.
        </p>
      </div>

      <form
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-lg flex flex-col gap-5"
        onSubmit={handleSubmit}
      >
        {error && <p className="text-red-600">{error}</p>}
        {info && <p className="text-green-700">{info}</p>}

        <div>
          <Label htmlFor="currentPassword" value="Current password" />
          <TextInput
            id="currentPassword"
            name="currentPassword"
            type="password"
            placeholder="Your current password"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="newPassword" value="New password" />
          <TextInput
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="At least 6 characters"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword" value="Confirm new password" />
          <TextInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Type the new password again"
            required
            className="mt-1"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="bg-blue-700 text-white font-semibold py-3 rounded-lg hover:bg-slate-900 disabled:bg-gray-400"
        >
          {busy ? "Please wait..." : "Update password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
