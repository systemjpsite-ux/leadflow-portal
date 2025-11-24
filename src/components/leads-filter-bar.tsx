'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';

const NICHES = ['All', 'Health', 'Wealth', 'Relationships'];
const LANGUAGES = [
  'All',
  'English',
  'Portuguese',
  'Spanish',
  'Japanese',
  'Chinese',
  'Hindi',
];
const COUNTRIES = [
  'All',
  'United States',
  'Brazil',
  'Spain',
  'Japan',
  'China',
  'India',
];

interface LeadsFilterBarProps {
  nicheFilter: string;
  setNicheFilter: (value: string) => void;
  languageFilter: string;
  setLanguageFilter: (value: string) => void;
  countryFilter: string;
  setCountryFilter: (value: string) => void;
}

export default function LeadsFilterBar({
  nicheFilter,
  setNicheFilter,
  languageFilter,
  setLanguageFilter,
  countryFilter,
  setCountryFilter,
}: LeadsFilterBarProps) {
  return (
    <Card>
      <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm mr-2">Niche:</span>
          {NICHES.map((niche) => (
            <Button
              key={niche}
              variant="outline"
              size="sm"
              onClick={() => setNicheFilter(niche)}
              className={cn(
                nicheFilter === niche
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : ''
              )}
            >
              {niche}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Select value={languageFilter} onValueChange={setLanguageFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang === 'All' ? 'All Languages' : lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country} value={country}>
                  {country === 'All' ? 'All Countries' : country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
