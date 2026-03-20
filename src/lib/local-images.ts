import { readdir } from "fs/promises";
import path from "path";

export type ImageCategory = "hero" | "suits" | "evening" | "essentials" | "lookbook";

export type LocalImageItem = {
  category: Exclude<ImageCategory, "hero" | "lookbook">;
  name: string;
  slug: string;
  src: string;
};

export type FrontpageImageItem = {
  src: string;
  name: string;
};

function toLabel(value: string) {
  return value
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b(hero|suit|evening|essential)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function toTitleCase(value: string) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

async function readFolder(folder: string) {
  const folderPath = path.join(process.cwd(), "public", "images", folder);

  try {
    const files = await readdir(folderPath);
    return files
      .filter((file) => !file.startsWith("."))
      .filter((file) => /\.(png|jpe?g|webp|avif|heic|heif)$/i.test(file))
      .sort((left, right) => left.localeCompare(right));
  } catch {
    return [];
  }
}

function extensionPriority(file: string) {
  const ext = path.extname(file).toLowerCase();

  switch (ext) {
    case ".avif":
      return 0;
    case ".webp":
      return 1;
    case ".jpg":
    case ".jpeg":
      return 2;
    case ".png":
      return 3;
    case ".heif":
    case ".heic":
      return 4;
    default:
      return 5;
  }
}

function dedupeByBaseName(files: string[]) {
  const preferredByBase = new Map<string, string>();

  for (const file of files) {
    const baseName = file.replace(/\.[^/.]+$/, "").toLowerCase();
    const existing = preferredByBase.get(baseName);

    if (!existing || extensionPriority(file) < extensionPriority(existing)) {
      preferredByBase.set(baseName, file);
    }
  }

  return [...preferredByBase.values()].sort((left, right) => left.localeCompare(right));
}

export async function getFrontpageImages(limit = 4): Promise<FrontpageImageItem[]> {
  const files = await readFolder("frontpage");

  return files.slice(0, limit).map((file, index) => ({
    src: `/images/frontpage/${file}`,
    name: `Frontpage ${index + 1}`,
  }));
}

export async function getHeroImage() {
  const files = await readFolder("hero");
  const firstFile = files[0];

  return firstFile ? `/images/hero/${firstFile}` : null;
}

export async function getLocalCategoryItems(
  category: Exclude<ImageCategory, "hero" | "lookbook">
): Promise<LocalImageItem[]> {
  const allFiles = await readFolder(category);
  const filteredFiles =
    category === "suits"
      ? allFiles.filter((file) => /suit/i.test(file))
      : category === "evening"
        ? allFiles.filter((file) => /evening/i.test(file))
        : category === "essentials"
          ? allFiles.filter((file) => /^IMG[_-]/i.test(file))
          : allFiles;
  const files = dedupeByBaseName(filteredFiles);

  return files.map((file) => {
    const cleaned = toLabel(file);
    const imgMatch = file.match(/^IMG[_-]?(\d+)/i);
    const token = cleaned || `${category} look`;
    const label =
      category === "essentials" && imgMatch
        ? `product ${imgMatch[1]}`
        : `${category.slice(0, -1)} ${token}`.trim();

    return {
      category,
      name: toTitleCase(label),
      slug:
        category === "essentials" && imgMatch
          ? `${category}-product-${imgMatch[1]}`
          : `${category}-${token.replace(/\s+/g, "-").toLowerCase()}`,
      src: `/images/${category}/${file}`,
    };
  });
}

export async function getShopItems() {
  return getLocalCategoryItems("essentials");
}

export async function getManItems() {
  const [suits, essentials] = await Promise.all([
    getLocalCategoryItems("suits"),
    getLocalCategoryItems("essentials"),
  ]);

  return [...suits, ...essentials];
}

export async function getWomanItems() {
  const evening = await getLocalCategoryItems("evening");
  return evening;
}

export async function getSuitBySlug(slug: string) {
  const items = await getLocalCategoryItems("suits");
  return items.find((item) => item.slug === slug) ?? null;
}

export async function getLookbookItems() {
  const dedicated = await readFolder("lookbook");

  if (dedicated.length) {
    return dedicated.map((file) => ({
      name: toTitleCase(toLabel(file) || "Lookbook image"),
      src: `/images/lookbook/${file}`,
    }));
  }

  const [suits, evening, essentials] = await Promise.all([
    getLocalCategoryItems("suits"),
    getLocalCategoryItems("evening"),
    getLocalCategoryItems("essentials"),
  ]);

  return [...suits, ...evening, ...essentials].map((item) => ({
    name: item.name,
    src: item.src,
  }));
}
