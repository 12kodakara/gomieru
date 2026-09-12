interface SourceBoxProps {
  municipalityName: string;
  sourceTitle: string;
  sourceUrl: string;
  checkedAt: string;
}

export default function SourceBox({ municipalityName, sourceTitle, sourceUrl, checkedAt }: SourceBoxProps) {
  return (
    <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
      <p className="text-sm font-bold text-gray-900">情報の出典</p>
      <dl className="space-y-1.5 text-sm">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="shrink-0 text-gray-500">情報確認日</dt>
          <dd className="text-right text-gray-700">{checkedAt}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="shrink-0 text-gray-500">自治体名</dt>
          <dd className="text-right text-gray-700">{municipalityName}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="shrink-0 text-gray-500">出典ページ名</dt>
          <dd className="min-w-0 flex-1 break-words text-right text-gray-700">{sourceTitle}</dd>
        </div>
      </dl>
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-lg bg-green-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 active:bg-green-800"
      >
        自治体公式情報を見る
        <span aria-hidden="true">↗</span>
        <span className="sr-only">(外部サイトが新しいタブで開きます)</span>
      </a>
    </div>
  );
}
