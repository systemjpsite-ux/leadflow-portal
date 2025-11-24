'use client';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Card } from './ui/card';
import { type Lead } from '@/app/leads/page';
import { format } from 'date-fns';
import { Skeleton } from './ui/skeleton';

interface LeadsTableProps {
  leads: Lead[];
  loading: boolean;
}

export default function LeadsTable({ leads, loading }: LeadsTableProps) {
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    // Firebase timestamps can be seconds/nanoseconds objects
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, 'MMM d, yyyy, h:mm a');
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Niche</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Agent Origin</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={8}>
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : leads.length > 0 ? (
            leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.niche}</TableCell>
                <TableCell>{lead.language}</TableCell>
                <TableCell>{lead.country}</TableCell>
                <TableCell>{lead.agentOrigin}</TableCell>
                <TableCell>{lead.status}</TableCell>
                <TableCell>{formatDate(lead.createdAt)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No leads found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
