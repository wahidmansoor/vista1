import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UniversalContentViewer } from './UniversalContentViewer';

const chapters = [
  { id: 'overview', title: 'Overview' },
  { id: 'symptom_control', title: 'Symptom Control' },
  { id: 'end_of_life', title: 'End of Life' },
];

const PalliativeHandbookTOC = () => {
  const navigate = useNavigate();
  const { chapterId } = useParams();
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (chapterId) {
      setLoading(true);
      setError(null);
      import(`./palliative/chapters/${chapterId}.md?raw`)
        .then((mod) => {
          setContent(mod.default || mod);
          setLoading(false);
        })
        .catch((err) => {
          setError(new Error('Chapter not found.'));
          setContent(null);
          setLoading(false);
        });
    } else {
      setContent(null);
      setError(null);
    }
  }, [chapterId]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Palliative Care Handbook</h1>
      <div className="flex flex-wrap gap-3 mb-8">
        {chapters.map((ch) => (
          <button
            key={ch.id}
            className={`px-4 py-2 rounded border ${chapterId === ch.id ? 'bg-green-600 text-white' : 'bg-white text-green-700 border-green-600'} hover:bg-green-50`}
            onClick={() => navigate(`/handbook/palliative/${ch.id}`)}
          >
            {ch.title}
          </button>
        ))}
      </div>
      {chapterId && (
        <div className="mt-8">
          <UniversalContentViewer
            content={content}
            format="markdown"
            isLoading={loading}
            error={error}
            title={chapters.find((c) => c.id === chapterId)?.title}
          />
        </div>
      )}
    </div>
  );
};

export default PalliativeHandbookTOC;
