import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';

interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: number;
  volume?: string;
  number?: string;
  pages?: string;
  publisher?: string;
}

const PublicationsSection = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const parseCSV = (csvText: string): Publication[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    
    console.log('CSV Headers:', headers);
    
    const publications: Publication[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      
      // Simple CSV parsing - handle quoted fields
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim()); // Add the last value
      
      if (values.length >= 8) { // Ensure we have at least the required fields
        const publication: Publication = {
          authors: values[0]?.replace(/"/g, '') || 'Unknown authors',
          title: values[1]?.replace(/"/g, '') || 'Untitled',
          venue: values[2]?.replace(/"/g, '') || 'Unknown venue',
          year: parseInt(values[6]) || new Date().getFullYear(),
          volume: values[3]?.replace(/"/g, '') || undefined,
          number: values[4]?.replace(/"/g, '') || undefined,
          pages: values[5]?.replace(/"/g, '') || undefined,
          publisher: values[7]?.replace(/"/g, '') || undefined,
          link: values[8]?.replace(/"/g, '') || undefined
        };
        publications.push(publication);
      }
    }
    
    // Sort in reverse chronological order (newest first)
    return publications.sort((a, b) => b.year - a.year);
  };

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch('/gscholar_publications.csv');
        if (!response.ok) {
          throw new Error('Failed to fetch CSV file');
        }
        const csvText = await response.text();
        console.log('CSV content:', csvText);
        
        const parsedPublications = parseCSV(csvText);
        console.log('Parsed publications:', parsedPublications);
        
        setPublications(parsedPublications);
      } catch (error) {
        console.error('Error loading publications:', error);
        setPublications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublications();
  }, []);

  return (
    <Card className="bg-white/80 border-warmBrown/20 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-warmBrown font-mono">Publications</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-warmBrown"></div>
            <p className="mt-2 text-warmBrown/70">Loading publications...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {publications.length > 0 ? (
              publications.map((pub, index) => (
                <div key={index} className="border-l-4 border-warmBrown/20 pl-4">
                  <h3 className="font-semibold text-warmBrown text-lg mb-2">
                    <a href={pub.link}>{pub.title}</a>
                  </h3>
                  <p className="text-warmBrown/70 text-sm mb-1">
                    {pub.authors}
                  </p>
                  <p className="text-warmBrown/60 text-sm mb-2">
                    {pub.venue} • {pub.year}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-warmBrown/60 text-center py-8">
                No publications found.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PublicationsSection;
