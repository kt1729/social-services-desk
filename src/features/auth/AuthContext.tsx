import { useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../shared/lib/firebase';
import { AuthContext, type VolunteerProfile } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [volunteer, setVolunteer] = useState<VolunteerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
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
