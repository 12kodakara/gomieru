import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import FormattedText from "@/components/FormattedText";
import SearchBox from "@/components/SearchBox";
import SourceBox from "@/components/SourceBox";
import { categoryColorClasses } from "@/lib/categoryColor";
import {
  getItemById,
  getItemCheckedAt,
  getItemSourceTitle,
  getItemSourceUrl,
  getItemsByMunicipality,
} from "@/lib/items";
import { getCategoryById, getMunicipalities, getMunicipalityById, getPrefectureById } from "@/lib/municipality";
import { getMunicipalityRules } from "@/lib/municipalityRules";

interface ItemPageProps {
  params: Promise<{ prefecture: string; municipality: string; item: string }>;
}

// 結論欄のテキスト長に応じてフォントサイズを調整し、長いdisposal_methodでも
// スマートフォン幅ではみ出さないようにする。
function getConclusionTextSizeClass(text: string): string {
  if (text.length > 12) return "text-xl sm:text-2xl";
  if (text.length > 6) return "text-2xl sm:text-3xl";
  return "text-3xl sm:text-4xl";
}

export function generateStaticParams() {
  return getMunicipalities().flatMap((municipality) =>
    getItemsByMunicipality(municipality.id).map((item) => ({
      prefecture: municipality.prefecture_id,
      municipality: municipality.id,
      item: item.id,
    })),
  );
}

export async function generateMetadata({ params }: ItemPageProps): Promise<Metadata> {
  const { prefecture: prefectureId, municipality: municipalityId, item: itemId } = await params;
  const municipality = getMunicipalityById(municipalityId);
  if (!municipality || municipality.prefecture_id !== prefectureId) return {};

  const item = getItemById(municipality.id, itemId);
  if (!item) return {};

  const category = getCategoryById(municipality, item.category);
  const title = `${municipality.name}で${item.name}を捨てる方法`;
  const description = `${municipality.name}での${item.name}の捨て方は「${category?.name ?? "-"}」です。出し方・注意点・公式情報をまとめて確認できます。`;

  return {
    title,
    description,
    alternates: { canonical: `/${prefectureId}/${municipalityId}/${itemId}/` },
    openGraph: { title, description },
  };
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { prefecture: prefectureId, municipality: municipalityId, item: itemId } = await params;
  const municipality = getMunicipalityById(municipalityId);
  if (!municipality || municipality.prefecture_id !== prefectureId) notFound();

  const item = getItemById(municipality.id, itemId);
  if (!item) notFound();

  const prefecture = getPrefectureById(prefectureId);
  const category = getCategoryById(municipality, item.category);
  const colors = category ? categoryColorClasses[category.color] : undefined;
  const sourceUrl = getItemSourceUrl(item);
  const checkedAt = getItemCheckedAt(item);
  const conclusionText = item.disposal_method ?? category?.name ?? "分類情報準備中";
  const municipalityRules = getMunicipalityRules(municipality.id);
  const ruleRefs = item.municipality_rule_refs ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs
        items={[
          { name: "トップ", href: "/" },
          { name: prefecture?.name ?? prefectureId, href: `/${prefectureId}/` },
          { name: municipality.name, href: `/${prefectureId}/${municipalityId}/` },
          { name: item.name },
        ]}
      />
      <p className="mt-3 text-sm text-gray-500">{municipality.name}のごみ分別</p>
      <h1 className="mt-1 text-2xl font-extrabold text-gray-900 sm:text-3xl">
        {municipality.name}で{item.name}を捨てる方法
      </h1>

      <div className={`mt-6 rounded-2xl border-2 p-6 text-center ${colors?.border ?? "border-gray-200"} ${colors?.bg ?? "bg-gray-50"}`}>
        <p className="text-sm font-semibold text-gray-500">結論</p>
        <p
          className={`mt-1 break-words font-extrabold ${getConclusionTextSizeClass(conclusionText)} ${colors?.text ?? "text-gray-900"}`}
        >
          {conclusionText}
        </p>
        {item.disposal_method && category && item.disposal_method !== category.name && (
          <span
            className={`mt-2 inline-block w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors?.bg ?? "bg-gray-100"} ${colors?.text ?? "text-gray-600"}`}
          >
            分類：{category.name}
          </span>
        )}

        {item.conditions && item.conditions.length > 0 && (
          <div className="mt-4 space-y-2 text-left">
            <p className="text-center text-xs font-semibold text-gray-500">⚠ 条件によって捨て方が変わります</p>
            {item.conditions.map((cond, index) => (
              <div key={index} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
                <p className="text-gray-500">{cond.condition}</p>
                <p className={`font-bold ${colors?.text ?? "text-gray-900"}`}>→ {cond.disposal_method}</p>
                {cond.note && <p className="mt-1 text-xs text-gray-400">{cond.note}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <section className="mt-8 space-y-6">
        <div>
          <h2 className="text-base font-bold text-gray-900">出し方</h2>
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
            <h2 className="text-base font-bold text-gray-900">{municipality.name}の粗大ごみ共通の出し方</h2>
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
            <h2 className="text-base font-bold text-gray-900">{municipality.name}の家電リサイクル法対象品の処分方法</h2>
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
            <h2 className="text-base font-bold text-gray-900">{municipality.name}の小型家電回収ボックスについて</h2>
            <FormattedText
              text={municipalityRules.smallApplianceBox.description}
              className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700"
            />
          </div>
        )}

        <div>
          <h2 className="text-base font-bold text-gray-900">注意点</h2>
          <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <FormattedText text={item.notes} className="whitespace-pre-line text-sm leading-relaxed text-amber-900" />
          </div>
        </div>

        {item.alternatives && (
          <div>
            <h2 className="text-base font-bold text-gray-900">捨てる以外の方法</h2>
            <p className="mt-1 text-xs text-gray-400">※自治体公式情報ではない参考情報です</p>
            <FormattedText
              text={item.alternatives}
              className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700"
            />
          </div>
        )}

        {sourceUrl && checkedAt && (
          <div>
            <SourceBox
              municipalityName={municipality.name}
              sourceTitle={getItemSourceTitle(item, municipality)}
              sourceUrl={sourceUrl}
              checkedAt={checkedAt}
            />
          </div>
        )}

        <div>
          <h2 className="text-base font-bold text-gray-900">他の品目を調べる</h2>
          <div className="mt-3">
            <SearchBox placeholder={`${municipality.name}のごみ品目を検索`} />
          </div>
        </div>
      </section>
    </div>
  );
}
