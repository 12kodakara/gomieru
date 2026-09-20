import ItemLinkGrid from "./ItemLinkGrid";
import FormattedText from "./FormattedText";
import { categoryColorClasses } from "@/lib/categoryColor";
import { getItemCheckedAt, getItemPath, getItemSourceTitle, getItemSourceUrl, getRelatedItems } from "@/lib/items";
import { getMunicipalityRules } from "@/lib/municipalityRules";
import type { Category, Municipality, WasteItem } from "@/lib/types";

interface ItemConclusionProps {
  item: WasteItem;
  municipality: Municipality;
  category?: Category;
}

const MAX_RELATED_ITEMS = 4;

// 結論文字が長い場合でもスマホ幅ではみ出さないよう調整する。
function getConclusionTextSizeClass(text: string): string {
  if (text.length > 12) return "text-xl sm:text-2xl";
  if (text.length > 6) return "text-2xl sm:text-3xl";
  return "text-3xl sm:text-4xl";
}

/**
 * 品目ページ・検索結果(単一一致時)の両方で使う本文。
 * 結論は枠線と分類色で強調して最初に示し、自治体・最終確認日は
 * 補足情報として小さな表にまとめ、役割を分けて重複表示を避ける。
 * そのあとに出し方・注意点・捨てる以外の方法・公式情報・関連する品目を続ける。
 */
export default function ItemConclusion({ item, municipality, category }: ItemConclusionProps) {
  const colors = category ? categoryColorClasses[category.color] : undefined;
  const sourceUrl = getItemSourceUrl(item);
  const checkedAt = getItemCheckedAt(item);
  const conclusionText = item.disposal_method ?? category?.name ?? "分類情報準備中";
  const municipalityRules = getMunicipalityRules(municipality.id);
  const ruleRefs = item.municipality_rule_refs ?? [];
  const relatedItems = getRelatedItems(item, MAX_RELATED_ITEMS);

  return (
    <div>
      <div className={`rounded-md border-2 p-4 ${colors?.border ?? "border-gray-300"}`}>
        <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
          <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${colors?.dot ?? "bg-gray-400"}`} />
          結論
        </p>
        <p className={`mt-1 break-words font-bold ${getConclusionTextSizeClass(conclusionText)} ${colors?.text ?? "text-gray-900"}`}>
          {conclusionText}
        </p>

        {item.conditions && item.conditions.length > 0 && (
          <div className="mt-3 space-y-2 border-t border-gray-200 pt-3">
            {item.conditions.map((cond, index) => (
              <div key={index} className="text-sm">
                <p className="text-gray-500">{cond.condition}</p>
                <p className={`font-bold ${colors?.text ?? "text-gray-900"}`}>→ {cond.disposal_method}</p>
                {cond.note && <p className="mt-0.5 text-xs text-gray-400">{cond.note}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <table className="mt-3 w-full border-collapse text-sm">
        <tbody>
          <tr className="border-b border-gray-200">
            <th className="w-[9.5rem] py-1.5 pr-3 text-left align-top font-semibold text-gray-500 sm:w-40">自治体</th>
            <td className="py-1.5 text-gray-900">{municipality.name}</td>
          </tr>
          {checkedAt && (
            <tr className="border-b border-gray-200">
              <th className="py-1.5 pr-3 text-left align-top font-semibold text-gray-500">最終確認日</th>
              <td className="py-1.5 text-gray-900">{checkedAt}</td>
            </tr>
          )}
        </tbody>
      </table>

      <section className="mt-6 space-y-6">
        <div>
          <h2 className="border-l-2 border-green-700 pl-2 text-base font-bold text-gray-900">出し方</h2>
          {item.steps && item.steps.length > 0 ? (
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-gray-700">
              {item.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          ) : (
            <FormattedText
              text={item.description}
              className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700"
            />
          )}
        </div>

        {ruleRefs.includes("bulkyWaste") && municipalityRules?.bulkyWaste && (
          <div>
            <h2 className="border-l-2 border-green-700 pl-2 text-base font-bold text-gray-900">
              {municipality.name}の粗大ごみ共通の出し方
            </h2>
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-gray-700">
              {municipalityRules.bulkyWaste.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
            {municipalityRules.bulkyWaste.notes && (
              <FormattedText
                text={municipalityRules.bulkyWaste.notes}
                className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700"
              />
            )}
          </div>
        )}

        {ruleRefs.includes("homeApplianceRecycling") && municipalityRules?.homeApplianceRecycling && (
          <div>
            <h2 className="border-l-2 border-green-700 pl-2 text-base font-bold text-gray-900">
              {municipality.name}の家電リサイクル法対象品の処分方法
            </h2>
            <FormattedText
              text={municipalityRules.homeApplianceRecycling.description}
              className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700"
            />
            {municipalityRules.homeApplianceRecycling.notes && (
              <FormattedText
                text={municipalityRules.homeApplianceRecycling.notes}
                className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700"
              />
            )}
          </div>
        )}

        {ruleRefs.includes("smallApplianceBox") && municipalityRules?.smallApplianceBox && (
          <div>
            <h2 className="border-l-2 border-green-700 pl-2 text-base font-bold text-gray-900">
              {municipality.name}の小型家電回収ボックスについて
            </h2>
            <FormattedText
              text={municipalityRules.smallApplianceBox.description}
              className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700"
            />
          </div>
        )}

        <div>
          <h2 className="border-l-2 border-amber-500 pl-2 text-base font-bold text-gray-900">注意点</h2>
          <FormattedText text={item.notes} className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700" />
        </div>

        {item.alternatives && (
          <div>
            <h2 className="border-l-2 border-green-700 pl-2 text-base font-bold text-gray-900">捨てる以外の方法</h2>
            <p className="mt-1 text-xs text-gray-400">※自治体公式情報ではない参考情報です</p>
            <FormattedText
              text={item.alternatives}
              className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700"
            />
          </div>
        )}

        {sourceUrl && (
          <div>
            <h2 className="border-l-2 border-green-700 pl-2 text-base font-bold text-gray-900">公式情報</h2>
            <p className="mt-2 text-sm">
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 underline underline-offset-2 hover:text-green-800"
              >
                {getItemSourceTitle(item, municipality)}
                <span aria-hidden="true"> ↗</span>
              </a>
              <span className="sr-only">(外部サイトが新しいタブで開きます)</span>
            </p>
          </div>
        )}

        {relatedItems.length > 0 && (
          <div>
            <h2 className="border-l-2 border-green-700 pl-2 text-base font-bold text-gray-900">関連する品目</h2>
            <div className="mt-2">
              <ItemLinkGrid
                items={relatedItems.map((related) => ({ name: related.name, href: getItemPath(related, municipality) }))}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
