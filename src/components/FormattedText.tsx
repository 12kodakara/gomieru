// 電話番号のような「数字-数字-数字」パターンだけ改行させないための簡易フォーマッタ。
// データの内容は一切変更せず、表示時にnowrapのspanで囲むだけ。
const PHONE_LIKE_PATTERN = /\d{2,5}-\d{2,5}(?:-\d{2,5})?/g;

interface FormattedTextProps {
  text: string;
  className?: string;
}

export default function FormattedText({ text, className }: FormattedTextProps) {
  const matches = [...text.matchAll(PHONE_LIKE_PATTERN)];
  if (matches.length === 0) {
    return <p className={className}>{text}</p>;
  }

  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  matches.forEach((match, index) => {
    const start = match.index ?? 0;
    if (start > cursor) nodes.push(text.slice(cursor, start));
    nodes.push(
      <span key={index} className="whitespace-nowrap">
        {match[0]}
      </span>,
    );
    cursor = start + match[0].length;
  });
  if (cursor < text.length) nodes.push(text.slice(cursor));

  return <p className={className}>{nodes}</p>;
}
