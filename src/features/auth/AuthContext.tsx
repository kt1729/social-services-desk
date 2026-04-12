import { useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../shared/lib/firebase';
import { isLocalMode } from '../../shared/lib/localMode';
import { mockVolunteer } from '../../shared/lib/mockData';
import { AuthContext, type VolunteerProfile } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const localMode = isLocalMode();
  const [user, setUser] = useState<User | null>(localMode ? ({ uid: 'local-user' } as User) : null);
  const [volunteer, setVolunteer] = useState<VolunteerProfile | null>(
    localMode
      ? {
          name: mockVolunteer.name,
          email: mockVolunteer.email,
          role: mockVolunteer.role,
        }
      : null,
  );
  const [loading, setLoading] = useState(!localMode);

  useEffect(() => {
    if (localMode) return () => undefined;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const volunteerDoc = await getDoc(doc(db, 'volunteers', firebaseUser.uid));
        if (volunteerDoc.exists()) {
          setVolunteer(volunteerDoc.data() as VolunteerProfile);
        } else {
          setVolunteer({
            name: firebaseUser.email ?? 'Unknown',
            email: firebaseUser.email ?? '',
            role: 'volunteer',
          });
        }
      } else {
        setVolunteer(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [localMode]);

  const login = async (email: string, password: string) => {
    if (isLocalMode()) return;
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (isLocalMode()) return;
    await signOut(auth);
    setVolunteer(null);
  };

  const isAdmin = volunteer?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, volunteer, loading, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
