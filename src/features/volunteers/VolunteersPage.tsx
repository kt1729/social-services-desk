import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../shared/lib/firebase';
import { useAuth } from '../auth/useAuth';
import Modal from '../../shared/components/Modal';
import ConfirmDialog from '../../shared/components/ConfirmDialog';
import type { VolunteerRole } from '../../shared/types';

interface Volunteer {
  uid: string;
  name: string;
  email: string;
  role: VolunteerRole;
  createdAt: Timestamp;
}

function AddVolunteerModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<VolunteerRole>('volunteer');
  const [uid, setUid] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedUid = uid.trim();
    if (!trimmedName || !trimmedEmail || !trimmedUid) return;

    setError('');
    setSaving(true);
    try {
      const existing = await getDoc(doc(db, 'volunteers', trimmedUid));
      if (existing.exists()) {
        setError('A volunteer with this UID already exists.');
        return;
      }
      await setDoc(doc(db, 'volunteers', trimmedUid), {
        name: trimmedName,
        email: trimmedEmail,
        role,
        createdAt: Timestamp.now(),
      });
      handleClose();
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    setName('');
    setEmail('');
    setRole('volunteer');
    setUid('');
    setError('');
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add Volunteer">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            autoFocus
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="volunteer@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as VolunteerRole)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="volunteer">Volunteer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Firebase UID</label>
          <input
            required
            value={uid}
            onChange={(e) => {
              setUid(e.target.value);
              setError('');
            }}
            placeholder="Paste UID here"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Find the UID in Firebase Console → Authentication → Users.
          </p>
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !name.trim() || !email.trim() || !uid.trim()}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Adding…' : 'Add Volunteer'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function VolunteersPage() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <VolunteersContent />;
}

function VolunteersContent() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Volunteer | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const snapshot = await getDocs(collection(db, 'volunteers'));
      if (cancelled) return;
      const docs = snapshot.docs.map((d) => ({
        uid: d.id,
        ...(d.data() as Omit<Volunteer, 'uid'>),
      }));
      setVolunteers(docs);
      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [showForm]);

  async function handleRoleChange(volunteer: Volunteer, newRole: VolunteerRole) {
    await updateDoc(doc(db, 'volunteers', volunteer.uid), { role: newRole });
    setVolunteers((prev) =>
      prev.map((v) => (v.uid === volunteer.uid ? { ...v, role: newRole } : v)),
    );
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteDoc(doc(db, 'volunteers', deleteTarget.uid));
    setVolunteers((prev) => prev.filter((v) => v.uid !== deleteTarget.uid));
    setDeleteTarget(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Volunteers</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          + Add Volunteer
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : volunteers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No volunteers yet.</p>
          <p className="text-sm">Add the first volunteer to grant app access.</p>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {volunteers.map((v) => (
                <tr key={v.uid} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{v.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{v.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={v.role}
                      onChange={(e) => handleRoleChange(v, e.target.value as VolunteerRole)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="volunteer">Volunteer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setDeleteTarget(v)}
                      className="text-sm text-red-500 hover:text-red-700"
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

      <AddVolunteerModal open={showForm} onClose={() => setShowForm(false)} />

      {deleteTarget && (
        <ConfirmDialog
          open={true}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete Volunteer"
          message={`Remove ${deleteTarget.name} from the volunteers list? This does not delete their Firebase Auth account.`}
          confirmLabel="Delete Volunteer"
        />
      )}
    </div>
  );
}
