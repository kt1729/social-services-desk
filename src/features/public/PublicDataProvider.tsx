import { useEffect, useState, type ReactNode } from 'react';
import { collection, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { db } from '../../shared/lib/firebase';
import type { Resource, ServiceDocument } from '../../shared/types';
import { PublicDataContext } from './PublicDataContext';
import { isLocalMode } from '../../shared/lib/localMode';
import { mockResources, mockDocuments } from '../../shared/lib/mockData';

function mapDocs<T>(snapshot: {
  docs: { id: string; data: () => Record<string, unknown> }[];
}): T[] {
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
}

export function PublicDataProvider({ children }: { children: ReactNode }) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [documents, setDocuments] = useState<ServiceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLocalMode()) {
      setResources(mockResources);
      setDocuments(mockDocuments);
      setLoading(false);
      return () => undefined;
    }

    const unsubs: Unsubscribe[] = [];
    let loadedCount = 0;
    const totalCollections = 2;

    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount >= totalCollections) setLoading(false);
    };

    const handleError = (err: Error) => {
      setError(
        err.message.includes('permission')
          ? 'Unable to load data. Public access may not be configured yet.'
          : 'Failed to load data. Please try again later.',
      );
      setLoading(false);
    };

    unsubs.push(
      onSnapshot(
        collection(db, 'resources'),
        (snap) => {
          setResources(mapDocs<Resource>(snap));
          checkLoaded();
        },
        handleError,
      ),
    );

    unsubs.push(
      onSnapshot(
        collection(db, 'documents'),
        (snap) => {
          setDocuments(mapDocs<ServiceDocument>(snap));
          checkLoaded();
        },
        handleError,
      ),
    );

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, []);

  return (
    <PublicDataContext.Provider value={{ resources, documents, loading, error }}>
      {children}
    </PublicDataContext.Provider>
  );
}
