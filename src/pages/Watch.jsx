import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MatchesAPI } from '../service/api';

export default function Watch() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const m = await MatchesAPI.get(id);
        setMatch(m);
      } catch (e) {
        setError('Unable to load match');
      }
    })();
  }, [id]);

  const title = match ? `${match?.teams?.[0]?.name || 'Team A'} vs ${match?.teams?.[1]?.name || 'Team B'}` : 'Loading...';
  const url = match?.streamUrl;

  return (
    <section className="min-h-[70vh] bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-xl font-semibold mb-4">{title}</h1>
        {error && <div className="rounded-md bg-rose-500/10 p-3 text-rose-300">{error}</div>}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
          {url ? (
            <iframe
              src={url}
              title="Match Stream"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white/60">
              No stream URL for this match.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
