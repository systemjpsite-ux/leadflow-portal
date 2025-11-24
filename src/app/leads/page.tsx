'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, query, onSnapshot, DocumentData, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import LeadsTable from '@/components/leads-table';
import LeadsFilterBar from '@/components/leads-filter-bar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export type Lead = {
  id: string;
  name: string;
  email: string;
  niche: string;
  language: string;
  country: string;
  agentOrigin: string;
  status: string;
  createdAt: Timestamp;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [nicheFilter, setNicheFilter] = useState('All');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');

  useEffect(() => {
    const q = query(collection(db, 'leads'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const leadsData: Lead[] = [];
      querySnapshot.forEach((doc) => {
        leadsData.push({ id: doc.id, ...doc.data() } as Lead);
      });
      setLeads(leadsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const nicheMatch = nicheFilter === 'All' || lead.niche === nicheFilter;
      const languageMatch =
        languageFilter === 'All' || lead.language.toLowerCase() === languageFilter.toLowerCase();
      const countryMatch = countryFilter === 'All' || lead.country === countryFilter;
      return nicheMatch && languageMatch && countryMatch;
    });
  }, [leads, nicheFilter, languageFilter, countryFilter]);

  return (
    <main className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Leads Dashboard</h1>
        <Button asChild>
          <Link href="/">Back to Form</Link>
        </Button>
      </div>
      <LeadsFilterBar
        nicheFilter={nicheFilter}
        setNicheFilter={setNicheFilter}
        languageFilter={languageFilter}
        setLanguageFilter={setLanguageFilter}
        countryFilter={countryFilter}
        setCountryFilter={setCountryFilter}
      />
      <div className="mt-6">
        <LeadsTable leads={filteredLeads} loading={loading} />
      </div>
    </main>
  );
}
