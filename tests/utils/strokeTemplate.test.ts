import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  transformPathD,
  transformNumbers,
  extractStrokePaths,
  extractNumbers,
  sampleSvgPathMath,
  buildStrokeGuideSvg,
  loadKanaTemplate
} from '@/utils/strokeTemplate';

describe('strokeTemplate utility', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('transformPathD', () => {
    it('correctly transforms M and c commands using affine parameters', () => {
      const originalD = 'M24.53,22.75c1.25,1.5,1.62,3.75,1.12,6.38';
      // sx=0.5, sy=0.5, tx=25, ty=25:
      // x' = (24.53 - 54.5) * 0.5 + 25 = -14.985 + 25 = 10.015 -> 10.02
      // y' = (22.75 - 54.5) * 0.5 + 25 = -15.875 + 25 = 9.125 -> 9.13
      // dx1' = 1.25 * 0.5 = 0.625 -> 0.63, dy1' = 1.5 * 0.5 = 0.75
      const transformed = transformPathD(originalD, 0.5, 0.5, 25, 25);

      expect(transformed).toContain('M10.02,9.13');
      expect(transformed).toContain('c0.63,0.75 0.81,1.88 0.56,3.19');
    });
  });

  describe('transformNumbers', () => {
    it('scales coordinates and increments stroke number by offset', () => {
      const svgText = `
        <g id="kvg:StrokeNumbers_test">
          <text transform="matrix(1 0 0 1 20 30)">1</text>
          <text transform="matrix(1 0 0 1 40 60)">2</text>
        </g>
      `;

      const nums = transformNumbers(svgText, 0.5, 0.5, 30, 30, 3);
      expect(nums).toHaveLength(2);
      expect(nums[0].num).toBe(4);
      expect(nums[1].num).toBe(5);
      // origX=20: (20 - 54.5)*0.5 + 30 = -17.25 + 30 = 12.75
      expect(nums[0].transform).toContain('12.75');
    });
  });

  describe('sampleSvgPathMath', () => {
    it('samples 32 equidistant points from path with M and c', () => {
      const pathD = 'M24.53,22.75c1.25,1.5,1.62,3.75,1.12,6.38c-3,15.88-9,32.5-7.38,47.62';
      const pts = sampleSvgPathMath(pathD, 32);

      expect(pts).toHaveLength(32);
      expect(pts[0].x).toBeCloseTo(24.53, 1);
      expect(pts[0].y).toBeCloseTo(22.75, 1);
    });

    it('returns empty array if path has no points', () => {
      expect(sampleSvgPathMath('')).toEqual([]);
    });
  });

  describe('extractStrokePaths and extractNumbers', () => {
    it('extracts stroke paths and numbers from standard KanjiVG SVG', () => {
      const mockSvg = `
        <svg viewBox="0 0 109 109">
          <g id="kvg:StrokePaths_0306b">
            <path id="kvg:0306b-s1" d="M10,20c1,2,3,4,5,6"/>
            <path id="kvg:0306b-s2" d="M30,40c1,2,3,4,5,6"/>
          </g>
          <g id="kvg:StrokeNumbers_0306b">
            <text transform="matrix(1 0 0 1 12 18)">1</text>
            <text transform="matrix(1 0 0 1 32 38)">2</text>
          </g>
        </svg>
      `;

      const paths = extractStrokePaths(mockSvg);
      expect(paths).toEqual(['M10,20c1,2,3,4,5,6', 'M30,40c1,2,3,4,5,6']);

      const numbers = extractNumbers(mockSvg);
      expect(numbers).toHaveLength(2);
      expect(numbers[0].num).toBe(1);
      expect(numbers[1].num).toBe(2);
    });
  });

  describe('buildStrokeGuideSvg', () => {
    it('creates an SVG containing all paths and formatted number texts', () => {
      const paths = ['M10,10c1,1,2,2,3,3'];
      const numbers = [{ transform: 'matrix(1 0 0 1 15 15)', num: 1 }];
      const svg = buildStrokeGuideSvg(paths, numbers);

      expect(svg).toContain('<svg');
      expect(svg).toContain('d="M10,10c1,1,2,2,3,3"');
      expect(svg).toContain('>1</text>');
      expect(svg).toContain('stroke="currentColor"');
    });
  });

  describe('loadKanaTemplate', () => {
    it('returns null for empty input', async () => {
      const res = await loadKanaTemplate('');
      expect(res).toBeNull();
    });

    it('loads and parses single kana character template', async () => {
      const mockSvg = `
        <svg viewBox="0 0 109 109">
          <g id="kvg:StrokePaths_03042">
            <path id="kvg:03042-s1" d="M20,30c2,2,4,4,6,6"/>
          </g>
          <g id="kvg:StrokeNumbers_03042">
            <text transform="matrix(1 0 0 1 18 28)">1</text>
          </g>
        </svg>
      `;

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: async () => mockSvg
      } as any);

      const template = await loadKanaTemplate('あ');
      expect(template).not.toBeNull();
      expect(template?.paths).toHaveLength(1);
      expect(template?.strokes).toHaveLength(1);
      expect(template?.strokes[0]).toHaveLength(32);
      expect(template?.numbers).toHaveLength(1);
      expect(template?.svgContent).toContain('>1</text>');
    });

    it('loads and combines compound kana (Yoon) characters sequentially', async () => {
      const mockSvg1 = `
        <svg viewBox="0 0 109 109">
          <g id="kvg:StrokePaths_0306b">
            <path id="kvg:0306b-s1" d="M20,30c2,2,4,4,6,6"/>
            <path id="kvg:0306b-s2" d="M40,50c2,2,4,4,6,6"/>
          </g>
          <g id="kvg:StrokeNumbers_0306b">
            <text transform="matrix(1 0 0 1 18 28)">1</text>
            <text transform="matrix(1 0 0 1 38 48)">2</text>
          </g>
        </svg>
      `;
      const mockSvg2 = `
        <svg viewBox="0 0 109 109">
          <g id="kvg:StrokePaths_03083">
            <path id="kvg:03083-s1" d="M30,60c1,1,2,2,3,3"/>
          </g>
          <g id="kvg:StrokeNumbers_03083">
            <text transform="matrix(1 0 0 1 28 58)">1</text>
          </g>
        </svg>
      `;

      global.fetch = vi.fn().mockImplementation((url: string) => {
        if (url.includes('0306b')) {
          return Promise.resolve({ ok: true, text: async () => mockSvg1 });
        }
        return Promise.resolve({ ok: true, text: async () => mockSvg2 });
      });

      const template = await loadKanaTemplate('にゃ');
      expect(template).not.toBeNull();
      // Total 2 strokes for に + 1 stroke for ゃ = 3 strokes total
      expect(template?.paths).toHaveLength(3);
      expect(template?.strokes).toHaveLength(3);
      expect(template?.numbers).toHaveLength(3);
      expect(template?.numbers[2].num).toBe(3);

      // Verify continuous numbering: character 1 has 1, 2; character 2 has 3 (offset by 2)
      expect(template?.svgContent).toContain('>1</text>');
      expect(template?.svgContent).toContain('>2</text>');
      expect(template?.svgContent).toContain('>3</text>');
    });
  });
});
