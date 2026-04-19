import { useEffect, useState, type ReactNode } from 'react';
import { collection, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { db } from '../shared/lib/firebase';
import { useAuth } from '../features/auth/useAuth';
import type { Resource, Guest, ServiceDocument, Feedback, Note, Volunteer, Tag } from '../shared/types';
import { DataContext } from './DataContext';
import { isLocalMode } from '../shared/lib/localMode';
import { mockResources, mockGuests, mockDocuments, mockVolunteer } from '../shared/lib/mockData';

function mapDocs<T>(snapshot: {
  docs: { id: string; data: () => Record<string, unknown> }[];
}): T[] {
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [documents, setDocuments] = useState<ServiceDocument[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLocalMode()) {
      setResources(mockResources);
      setGuests(mockGuests);
      setDocuments(mockDocuments);
      setFeedback([]);
      setNotes([]);
      setVolunteers([mockVolunteer]);
      setTags([]);
      setLoading(false);
      return () => undefined;
    }

    if (!user) return;

    const unsubs: Unsubscribe[] = [];
    let loadedCount = 0;
    const totalCollections = 7;

    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount >= totalCollections) setLoading(false);
    };

    unsubs.push(
      onSnapshot(collection(db, 'resources'), (snap) => {
        setResources(mapDocs<Resource>(snap));
        checkLoaded();
      }),
    );

    unsubs.push(
      onSnapshot(collection(db, 'guests'), (snap) => {
        setGuests(mapDocs<Guest>(snap));
        checkLoaded();
      }),
    );

    unsubs.push(
      onSnapshot(collection(db, 'documents'), (snap) => {
        setDocuments(mapDocs<ServiceDocument>(snap));
        checkLoaded();
      }),
    );

    unsubs.push(
      onSnapshot(collection(db, 'feedback'), (snap) => {
        setFeedback(mapDocs<Feedback>(snap));
        checkLoaded();
      }),
    );

    unsubs.push(
      onSnapshot(collection(db, 'notes'), (snap) => {
        setNotes(mapDocs<Note>(snap));
        checkLoaded();
      }),
    );

    unsubs.push(
      onSnapshot(collection(db, 'volunteers'), (snap) => {
        setVolunteers(mapDocs<Volunteer>(snap));
        checkLoaded();
      }),
    );

    unsubs.push(
      onSnapshot(collection(db, 'tags'), (snap) => {
        setTags(mapDocs<Tag>(snap));
        checkLoaded();
      }),
    );

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [user]);

  const getVolunteerName = (id: string): string => {
    const vol = volunteers.find((v) => v.id === id);
    return vol?.name ?? 'Unknown Volunteer';
  };

  return (
    <DataContext.Provider
      value={{
        resources,
        guests,
        documents,
        feedback,
        notes,
        volunteers,
        tags,
        loading,
        getVolunteerName,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
