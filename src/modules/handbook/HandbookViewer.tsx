import { useParams } from "react-router-dom";
import MarkdownViewer from "../../components/MarkdownViewer";
import { Link } from "react-router-dom";

export default function HandbookViewer() {
  const { section, topic } = useParams<{ section: string; topic: string }>();

  const filePath = `/handbook/${section}/${topic}.md`;

  return (
    <div className="p-6">
      <Link
        to="/handbook"
        className="text-blue-600 hover:underline text-sm mb-4 inline-block"
      >
        ← Back to Handbook
      </Link>
      <MarkdownViewer filePath={filePath} />
    </div>
  );
}
