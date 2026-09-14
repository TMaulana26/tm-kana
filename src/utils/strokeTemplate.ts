import { type Point, resample } from "./strokeRecognizer";

export interface KanaTemplateData {
  strokes: Point[][];
  paths: string[];
  numbers: { transform: string; num: number }[];
  svgContent: string;
}

// Memory cache to avoid redundant network round-trips
const templateCache = new Map<string, KanaTemplateData>();

// Transform SVG path d commands (KanjiVG exclusively uses 'M' and 'c' for Kana)
export function transformPathD(
  d: string,
  sx: number,
  sy: number,
  tx: number,
  ty: number,
): string {
  return d
    .replace(/M\s*([-+]?\d*\.?\d+)[,\s]+([-+]?\d*\.?\d+)/, (_, x, y) => {
      const nx = (parseFloat(x) - 54.5) * sx + tx;
      const ny = (parseFloat(y) - 54.5) * sy + ty;
      return `M${nx.toFixed(2)},${ny.toFixed(2)}`;
    })
    .replace(/c\s*([-\d.,\s]+)/g, (_, coords) => {
      const nums = (coords.match(/[-+]?\d*\.?\d+/g) || []).map(Number);
      const scaled: string[] = [];
      for (let i = 0; i < nums.length; i += 2) {
        scaled.push(
          `${(nums[i] * sx).toFixed(2)},${(nums[i + 1] * sy).toFixed(2)}`,
        );
      }
      return "c" + scaled.join(" ");
    });
}

// Transform stroke numbers
export function transformNumbers(
  svgText: string,
  sx: number,
  sy: number,
  tx: number,
  ty: number,
  offsetNum = 0,
): { transform: string; num: number }[] {
  const matches = [
    ...svgText.matchAll(
      /<text\s+transform="matrix\([^)]*\s+([-+]?\d*\.?\d+)\s+([-+]?\d*\.?\d+)\)"[^>]*>(\d+)<\/text>/g,
    ),
  ];
  return matches.map((m) => {
    const origX = parseFloat(m[1]);
    const origY = parseFloat(m[2]);
    const origNum = parseInt(m[3], 10);
    const nx = (origX - 54.5) * sx + tx;
    const ny = (origY - 54.5) * sy + ty;
    return {
      transform: `matrix(1 0 0 1 ${nx.toFixed(2)} ${ny.toFixed(2)})`,
      num: origNum + offsetNum,
    };
  });
}

// Extract stroke paths from KanjiVG SVG
export function extractStrokePaths(svgText: string): string[] {
  const strokeBlock = svgText.match(
    /<g[^>]+id="kvg:StrokePaths_[^"]*"[^>]*>([\s\S]*?)<\/g>/,
  );
  const block = strokeBlock ? strokeBlock[1] : svgText;
  const paths: string[] = [];
  const matches = [...block.matchAll(/<path[^>]+d="([^"]+)"/g)];
  for (const m of matches) {
    paths.push(m[1]);
  }
  return paths;
}

// Extract stroke numbers from KanjiVG SVG (single character, untransformed)
export function extractNumbers(
  svgText: string,
): { transform: string; num: number }[] {
  const matches = [
    ...svgText.matchAll(
      /<text\s+transform="matrix\([^)]*\s+([-+]?\d*\.?\d+)\s+([-+]?\d*\.?\d+)\)"[^>]*>(\d+)<\/text>/g,
    ),
  ];
  return matches.map((m) => ({
    transform: `matrix(1 0 0 1 ${parseFloat(m[1]).toFixed(2)} ${parseFloat(m[2]).toFixed(2)})`,
    num: parseInt(m[3], 10),
  }));
}

// Pure math sampler for SVG paths with M and c commands (robust across JSDOM / browser / Node)
export function sampleSvgPathMath(d: string, numSamples = 32): Point[] {
  const points: Point[] = [];
  let curX = 0;
  let curY = 0;

  const mMatch = d.match(/M\s*([-+]?\d*\.?\d+)[,\s]+([-+]?\d*\.?\d+)/);
  if (mMatch) {
    curX = parseFloat(mMatch[1]);
    curY = parseFloat(mMatch[2]);
    points.push({ x: curX, y: curY });
  }

  const cMatches = [...d.matchAll(/c\s*([-\d.,\s]+)/g)];
  for (const cm of cMatches) {
    const nums = (cm[1].match(/[-+]?\d*\.?\d+/g) || []).map(Number);
    for (let i = 0; i < nums.length; i += 6) {
      const dx1 = nums[i];
      const dy1 = nums[i + 1];
      const dx2 = nums[i + 2];
      const dy2 = nums[i + 3];
      const dx = nums[i + 4];
      const dy = nums[i + 5];

      const p0x = curX;
      const p0y = curY;
      const p1x = curX + dx1;
      const p1y = curY + dy1;
      const p2x = curX + dx2;
      const p2y = curY + dy2;
      const p3x = curX + dx;
      const p3y = curY + dy;

      const steps = 10;
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const inv = 1 - t;
        const x =
          inv * inv * inv * p0x +
          3 * inv * inv * t * p1x +
          3 * inv * t * t * p2x +
          t * t * t * p3x;
        const y =
          inv * inv * inv * p0y +
          3 * inv * inv * t * p1y +
          3 * inv * t * t * p2y +
          t * t * t * p3y;
        points.push({ x, y });
      }

      curX = p3x;
      curY = p3y;
    }
  }

  if (points.length === 0) return [];
  return resample(points, numSamples);
}

let sharedPathEl: SVGPathElement | null = null;

// Sample points from SVG path
export function sampleSvgPath(d: string, numSamples = 32): Point[] {
  if (typeof document !== "undefined") {
    try {
      if (!sharedPathEl) {
        sharedPathEl = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
      }
      sharedPathEl.setAttribute("d", d);
      const totalLen = sharedPathEl.getTotalLength
        ? sharedPathEl.getTotalLength()
        : 0;
      if (totalLen > 0) {
        const pts: Point[] = [];
        for (let i = 0; i < numSamples; i++) {
          const dist = (i / (numSamples - 1)) * totalLen;
          const pt = sharedPathEl.getPointAtLength(dist);
          pts.push({ x: pt.x, y: pt.y });
        }
        return pts;
      }
    } catch {
      // Fall through to pure math sampler
    }
  }
  return sampleSvgPathMath(d, numSamples);
}

// Build complete inline SVG with paths and stroke numbers
export function buildStrokeGuideSvg(
  paths: string[],
  numbers: { transform: string; num: number }[],
): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 109 109" class="w-full h-full text-slate-950 dark:text-white">
  <line x1="0" y1="54.5" x2="109" y2="54.5" stroke="currentColor" stroke-dasharray="2,2" stroke-opacity="0.25" stroke-width="1"/>
  <line x1="54.5" y1="0" x2="54.5" y2="109" stroke="currentColor" stroke-dasharray="2,2" stroke-opacity="0.25" stroke-width="1"/>
  <g fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
    ${paths.map((d) => `<path d="${d}"/>`).join("\n    ")}
  </g>
  <g>
    ${numbers
      .map(
        (n) =>
          `<text transform="${n.transform}" font-size="7.5" font-family="sans-serif" font-weight="900" fill="currentColor" fill-opacity="0.75">${n.num}</text>`,
      )
      .join("\n    ")}
  </g>
</svg>`;
}

// Fetch raw SVG text for a single character from KanjiVG
async function fetchRawSvg(char: string): Promise<string> {
  const hex = char.charCodeAt(0).toString(16).toLowerCase().padStart(5, "0");
  const url = `https://raw.githubusercontent.com/KanjiVG/KanjiVG/master/kanji/${hex}.svg`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`KanjiVG SVG not found for ${char} (${hex})`);
  }
  return response.text();
}

/**
 * Load template data for any kana character (single or compound Yoon).
 * Handles parallel fetching, geometric scaling/offset, stroke ordering, and stroke numbering.
 */
export async function loadKanaTemplate(
  character: string,
): Promise<KanaTemplateData | null> {
  if (!character) return null;

  if (templateCache.has(character)) {
    return templateCache.get(character)!;
  }

  const chars = Array.from(character);

  try {
    if (chars.length === 1) {
      // Single kana
      const svgText = await fetchRawSvg(chars[0]);
      const rawPaths = extractStrokePaths(svgText);
      const numbers = extractNumbers(svgText);

      const strokes: Point[][] = rawPaths.map((d) => sampleSvgPath(d, 32));
      const svgContent = buildStrokeGuideSvg(rawPaths, numbers);

      const data: KanaTemplateData = {
        strokes,
        paths: rawPaths,
        numbers,
        svgContent,
      };
      templateCache.set(character, data);
      return data;
    }

    if (chars.length === 2) {
      // Compound kana (Yoon)
      const [svgText1, svgText2] = await Promise.all([
        fetchRawSvg(chars[0]),
        fetchRawSvg(chars[1]),
      ]);

      const rawPaths1 = extractStrokePaths(svgText1);
      const rawPaths2 = extractStrokePaths(svgText2);

      // Transform parameters:
      // Left character (main kana): centered in left half
      const sx1 = 0.52,
        sy1 = 0.88,
        tx1 = 28,
        ty1 = 54.5;
      // Right character (subscript Yoon kana): positioned in lower-right
      const sx2 = 0.48,
        sy2 = 0.72,
        tx2 = 78,
        ty2 = 58;

      const tPaths1 = rawPaths1.map((d) =>
        transformPathD(d, sx1, sy1, tx1, ty1),
      );
      const tPaths2 = rawPaths2.map((d) =>
        transformPathD(d, sx2, sy2, tx2, ty2),
      );

      const tNums1 = transformNumbers(svgText1, sx1, sy1, tx1, ty1, 0);
      const tNums2 = transformNumbers(
        svgText2,
        sx2,
        sy2,
        tx2,
        ty2,
        rawPaths1.length,
      );

      const combinedPaths = [...tPaths1, ...tPaths2];
      const combinedNumbers = [...tNums1, ...tNums2];

      const strokes: Point[][] = combinedPaths.map((d) => sampleSvgPath(d, 32));
      const svgContent = buildStrokeGuideSvg(combinedPaths, combinedNumbers);

      const data: KanaTemplateData = {
        strokes,
        paths: combinedPaths,
        numbers: combinedNumbers,
        svgContent,
      };
      templateCache.set(character, data);
      return data;
    }

    return null;
  } catch (err) {
    console.warn(`Failed to load template for kana: ${character}`, err);
    return null;
  }
}
