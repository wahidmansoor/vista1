import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UniversalContentViewer } from './UniversalContentViewer';

const chapters = [
  { id: 'basics', title: 'Radiation Basics' },
  { id: 'planning', title: 'Planning' },
  { id: 'toxicity', title: 'Toxicity' },
];

const RadiationHandbookTOC = () => {
  const navigate = useNavigate();
  const { chapterId } = useParams();
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (chapterId) {
      setLoading(true);
      setError(null);
      fetch(`/handbook/radiation/chapters/${chapterId}.md`)
        .then(async (res) => {
          if (!res.ok) throw new Error('Chapter not found.');
          return res.text();
        })
        .then((text) => {
          setContent(text);
          setLoading(false);
        })
        .catch((err) => {
          setError(new Error('Chapter not found.'));
          setContent(null);
        });
    } else {
      setContent(null);
    }
  }, [chapterId]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Radiation Oncology Handbook</h1>
      <div className="flex flex-wrap gap-3 mb-8">
        {chapters.map((ch) => (
          <button
            key={ch.id}
            className={`px-4 py-2 rounded border ${chapterId === ch.id ? 'bg-purple-600 text-white' : 'bg-white text-purple-700 border-purple-600'} hover:bg-purple-50`}
            onClick={() => navigate(`/handbook/radiation/${ch.id}`)}
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

export default RadiationHandbookTOC;
