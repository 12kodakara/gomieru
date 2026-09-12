"use client";

import { useRouter } from "next/navigation";
import { useId, useMemo, useState, type FormEvent, type KeyboardEvent } from "react";
import { getSuggestionIndex, normalizeQuery, type SearchSuggestion } from "@/lib/search";

// 品目データは小規模(100件程度)なため、モジュール読み込み時に一度だけ生成して使い回す。
// レンダー中にrefへ書き込むと react-hooks/refs に抵触するため、ここでキャッシュする。
let cachedSuggestionIndex: SearchSuggestion[] | null = null;
function loadSuggestionIndex(): SearchSuggestion[] {
  if (!cachedSuggestionIndex) {
    cachedSuggestionIndex = getSuggestionIndex();
  }
  return cachedSuggestionIndex;
}

interface SearchBoxProps {
  placeholder?: string;
  defaultValue?: string;
}

const MAX_SUGGESTIONS = 8;

export default function SearchBox({ placeholder, defaultValue }: SearchBoxProps) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listboxId = useId();
  const router = useRouter();

  const suggestions = useMemo(() => {
    const query = normalizeQuery(value);
    if (!query) return [];

    // スコアが低いほど優先表示: 0=name完全一致 1=name前方一致 2=nameに含む
    // 3=aliasに一致 のみ。いずれにも一致しない候補は除外する。
    const matches: { suggestion: SearchSuggestion; score: number }[] = [];
    for (const suggestion of loadSuggestionIndex()) {
      const name = normalizeQuery(suggestion.name);
      if (name === query) {
        matches.push({ suggestion, score: 0 });
      } else if (name.startsWith(query)) {
        matches.push({ suggestion, score: 1 });
      } else if (name.includes(query)) {
        matches.push({ suggestion, score: 2 });
      } else if (suggestion.aliases.some((alias) => normalizeQuery(alias).includes(query))) {
        matches.push({ suggestion, score: 3 });
      }
    }

    return matches
      .sort((a, b) => a.score - b.score)
      .map(({ suggestion }) => suggestion)
      .slice(0, MAX_SUGGESTIONS);
  }, [value]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      router.push(suggestions[activeIndex].href);
      setIsOpen(false);
      return;
    }
    const query = value.trim();
    if (!query) return;
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  function handleSelect(suggestion: SearchSuggestion) {
    setIsOpen(false);
    setActiveIndex(-1);
    router.push(suggestion.href);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  const showDropdown = isOpen && suggestions.length > 0;

  return (
    <form onSubmit={handleSubmit} className="relative w-full" role="search">
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <div className="relative w-full">
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400"
          >
            <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M13.8 13.8 17.5 17.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setIsOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => {
              // クリック・タップの選択を先に処理させるため、少し遅らせて閉じる。
              setTimeout(() => setIsOpen(false), 150);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder ?? "捨てたいものを入力（例：布団、テレビ、モバイルバッテリー）"}
            aria-label="ごみの品目を検索"
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
            autoComplete="off"
            className="w-full rounded-lg border border-gray-300 bg-white py-3.5 pl-11 pr-4 text-base text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-1 focus:ring-green-600"
          />
        </div>

        <button
          type="submit"
          className="shrink-0 rounded-md bg-green-700 px-6 py-3.5 text-base font-bold text-white transition hover:bg-green-800 active:bg-green-900"
        >
          捨て方を調べる
        </button>
      </div>

      {showDropdown && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute inset-x-0 top-full z-50 mt-1.5 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
        >
          {suggestions.map((suggestion, index) => (
            <li key={suggestion.id} role="presentation">
              <button
                type="button"
                id={`${listboxId}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                onMouseDown={(event) => {
                  // blur より先に発火させ、選択を確実に処理する。
                  event.preventDefault();
                  handleSelect(suggestion);
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex w-full flex-col gap-0.5 px-4 py-3 text-left ${
                  index === activeIndex ? "bg-green-50" : "bg-white"
                } ${index > 0 ? "border-t border-gray-100" : ""}`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-gray-900">{suggestion.name}</span>
                  {suggestion.categoryName && (
                    <span className="shrink-0 text-xs text-gray-400">{suggestion.categoryName}</span>
                  )}
                </span>
                {suggestion.disposalMethod && suggestion.disposalMethod !== suggestion.categoryName && (
                  <span className="text-xs text-green-700">{suggestion.disposalMethod}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
