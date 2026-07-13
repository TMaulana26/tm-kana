export interface KanaCharacter {
  char: string;
  romaji: string;
  type: 'hiragana' | 'katakana';
  group: 'gojuon' | 'dakuon' | 'yoon';
  row: string;
}

export const HIRAGANA_DATA: KanaCharacter[] = [
  // Gojuon
  { char: 'あ', romaji: 'a', type: 'hiragana', group: 'gojuon', row: 'a' },
  { char: 'い', romaji: 'i', type: 'hiragana', group: 'gojuon', row: 'a' },
  { char: 'う', romaji: 'u', type: 'hiragana', group: 'gojuon', row: 'a' },
  { char: 'え', romaji: 'e', type: 'hiragana', group: 'gojuon', row: 'a' },
  { char: 'お', romaji: 'o', type: 'hiragana', group: 'gojuon', row: 'a' },

  { char: 'か', romaji: 'ka', type: 'hiragana', group: 'gojuon', row: 'k' },
  { char: 'き', romaji: 'ki', type: 'hiragana', group: 'gojuon', row: 'k' },
  { char: 'く', romaji: 'ku', type: 'hiragana', group: 'gojuon', row: 'k' },
  { char: 'け', romaji: 'ke', type: 'hiragana', group: 'gojuon', row: 'k' },
  { char: 'こ', romaji: 'ko', type: 'hiragana', group: 'gojuon', row: 'k' },

  { char: 'さ', romaji: 'sa', type: 'hiragana', group: 'gojuon', row: 's' },
  { char: 'し', romaji: 'shi', type: 'hiragana', group: 'gojuon', row: 's' },
  { char: 'す', romaji: 'su', type: 'hiragana', group: 'gojuon', row: 's' },
  { char: 'せ', romaji: 'se', type: 'hiragana', group: 'gojuon', row: 's' },
  { char: 'そ', romaji: 'so', type: 'hiragana', group: 'gojuon', row: 's' },

  { char: 'た', romaji: 'ta', type: 'hiragana', group: 'gojuon', row: 't' },
  { char: 'ち', romaji: 'chi', type: 'hiragana', group: 'gojuon', row: 't' },
  { char: 'つ', romaji: 'tsu', type: 'hiragana', group: 'gojuon', row: 't' },
  { char: 'て', romaji: 'te', type: 'hiragana', group: 'gojuon', row: 't' },
  { char: 'と', romaji: 'to', type: 'hiragana', group: 'gojuon', row: 't' },

  { char: 'な', romaji: 'na', type: 'hiragana', group: 'gojuon', row: 'n' },
  { char: 'に', romaji: 'ni', type: 'hiragana', group: 'gojuon', row: 'n' },
  { char: 'ぬ', romaji: 'nu', type: 'hiragana', group: 'gojuon', row: 'n' },
  { char: 'ね', romaji: 'ne', type: 'hiragana', group: 'gojuon', row: 'n' },
  { char: 'の', romaji: 'no', type: 'hiragana', group: 'gojuon', row: 'n' },

  { char: 'は', romaji: 'ha', type: 'hiragana', group: 'gojuon', row: 'h' },
  { char: 'ひ', romaji: 'hi', type: 'hiragana', group: 'gojuon', row: 'h' },
  { char: 'ふ', romaji: 'fu', type: 'hiragana', group: 'gojuon', row: 'h' },
  { char: 'へ', romaji: 'he', type: 'hiragana', group: 'gojuon', row: 'h' },
  { char: 'ほ', romaji: 'ho', type: 'hiragana', group: 'gojuon', row: 'h' },

  { char: 'ま', romaji: 'ma', type: 'hiragana', group: 'gojuon', row: 'm' },
  { char: 'み', romaji: 'mi', type: 'hiragana', group: 'gojuon', row: 'm' },
  { char: 'む', romaji: 'mu', type: 'hiragana', group: 'gojuon', row: 'm' },
  { char: 'め', romaji: 'me', type: 'hiragana', group: 'gojuon', row: 'm' },
  { char: 'も', romaji: 'mo', type: 'hiragana', group: 'gojuon', row: 'm' },

  { char: 'や', romaji: 'ya', type: 'hiragana', group: 'gojuon', row: 'y' },
  { char: 'ゆ', romaji: 'yu', type: 'hiragana', group: 'gojuon', row: 'y' },
  { char: 'よ', romaji: 'yo', type: 'hiragana', group: 'gojuon', row: 'y' },

  { char: 'ら', romaji: 'ra', type: 'hiragana', group: 'gojuon', row: 'r' },
  { char: 'り', romaji: 'ri', type: 'hiragana', group: 'gojuon', row: 'r' },
  { char: 'る', romaji: 'ru', type: 'hiragana', group: 'gojuon', row: 'r' },
  { char: 'れ', romaji: 're', type: 'hiragana', group: 'gojuon', row: 'r' },
  { char: 'ろ', romaji: 'ro', type: 'hiragana', group: 'gojuon', row: 'r' },

  { char: 'わ', romaji: 'wa', type: 'hiragana', group: 'gojuon', row: 'w' },
  { char: 'を', romaji: 'wo', type: 'hiragana', group: 'gojuon', row: 'w' },
  { char: 'ん', romaji: 'n', type: 'hiragana', group: 'gojuon', row: 'w' },

  // Dakuon / Handakuon
  { char: 'が', romaji: 'ga', type: 'hiragana', group: 'dakuon', row: 'g' },
  { char: 'ぎ', romaji: 'gi', type: 'hiragana', group: 'dakuon', row: 'g' },
  { char: 'ぐ', romaji: 'gu', type: 'hiragana', group: 'dakuon', row: 'g' },
  { char: 'げ', romaji: 'ge', type: 'hiragana', group: 'dakuon', row: 'g' },
  { char: 'ご', romaji: 'go', type: 'hiragana', group: 'dakuon', row: 'g' },

  { char: 'ざ', romaji: 'za', type: 'hiragana', group: 'dakuon', row: 'z' },
  { char: 'じ', romaji: 'ji', type: 'hiragana', group: 'dakuon', row: 'z' },
  { char: 'ず', romaji: 'zu', type: 'hiragana', group: 'dakuon', row: 'z' },
  { char: 'ぜ', romaji: 'ze', type: 'hiragana', group: 'dakuon', row: 'z' },
  { char: 'zo', romaji: 'zo', type: 'hiragana', group: 'dakuon', row: 'z' }, // Note: そ -> zo typo in spec resolved as zo

  { char: 'だ', romaji: 'da', type: 'hiragana', group: 'dakuon', row: 'd' },
  { char: 'ぢ', romaji: 'ji', type: 'hiragana', group: 'dakuon', row: 'd' },
  { char: 'づ', romaji: 'zu', type: 'hiragana', group: 'dakuon', row: 'd' },
  { char: 'で', romaji: 'de', type: 'hiragana', group: 'dakuon', row: 'd' },
  { char: 'ど', romaji: 'do', type: 'hiragana', group: 'dakuon', row: 'd' },

  { char: 'ば', romaji: 'ba', type: 'hiragana', group: 'dakuon', row: 'b' },
  { char: 'び', romaji: 'bi', type: 'hiragana', group: 'dakuon', row: 'b' },
  { char: 'ぶ', romaji: 'bu', type: 'hiragana', group: 'dakuon', row: 'b' },
  { char: 'べ', romaji: 'be', type: 'hiragana', group: 'dakuon', row: 'b' },
  { char: 'ぼ', romaji: 'bo', type: 'hiragana', group: 'dakuon', row: 'b' },

  { char: 'ぱ', romaji: 'pa', type: 'hiragana', group: 'dakuon', row: 'p' },
  { char: 'ぴ', romaji: 'pi', type: 'hiragana', group: 'dakuon', row: 'p' },
  { char: 'ぷ', romaji: 'pu', type: 'hiragana', group: 'dakuon', row: 'p' },
  { char: 'ぺ', romaji: 'pe', type: 'hiragana', group: 'dakuon', row: 'p' },
  { char: 'ぽ', romaji: 'po', type: 'hiragana', group: 'dakuon', row: 'p' },

  // Yoon
  { char: 'きゃ', romaji: 'kya', type: 'hiragana', group: 'yoon', row: 'kya' },
  { char: 'きゅ', romaji: 'kyu', type: 'hiragana', group: 'yoon', row: 'kya' },
  { char: 'きょ', romaji: 'kyo', type: 'hiragana', group: 'yoon', row: 'kya' },

  { char: 'しゃ', romaji: 'sha', type: 'hiragana', group: 'yoon', row: 'sha' },
  { char: 'しゅ', romaji: 'shu', type: 'hiragana', group: 'yoon', row: 'sha' },
  { char: 'しょ', romaji: 'sho', type: 'hiragana', group: 'yoon', row: 'sha' },

  { char: 'ちゃ', romaji: 'cha', type: 'hiragana', group: 'yoon', row: 'cha' },
  { char: 'ちゅ', romaji: 'chu', type: 'hiragana', group: 'yoon', row: 'cha' },
  { char: 'ちょ', romaji: 'cho', type: 'hiragana', group: 'yoon', row: 'cha' },

  { char: 'にゃ', romaji: 'nya', type: 'hiragana', group: 'yoon', row: 'nya' },
  { char: 'にゅ', romaji: 'nyu', type: 'hiragana', group: 'yoon', row: 'nya' },
  { char: 'にょ', romaji: 'nyo', type: 'hiragana', group: 'yoon', row: 'nya' },

  { char: 'ひゃ', romaji: 'hya', type: 'hiragana', group: 'yoon', row: 'hya' },
  { char: 'ひゅ', romaji: 'hyu', type: 'hiragana', group: 'yoon', row: 'hya' },
  { char: 'ひょ', romaji: 'hyo', type: 'hiragana', group: 'yoon', row: 'hya' },

  { char: 'みゃ', romaji: 'mya', type: 'hiragana', group: 'yoon', row: 'mya' },
  { char: 'みゅ', romaji: 'myu', type: 'hiragana', group: 'yoon', row: 'mya' },
  { char: 'みょ', romaji: 'myo', type: 'hiragana', group: 'yoon', row: 'mya' },

  { char: 'りゃ', romaji: 'rya', type: 'hiragana', group: 'yoon', row: 'rya' },
  { char: 'りゅ', romaji: 'ryu', type: 'hiragana', group: 'yoon', row: 'rya' },
  { char: 'りょ', romaji: 'ryo', type: 'hiragana', group: 'yoon', row: 'rya' },

  { char: 'ぎゃ', romaji: 'gya', type: 'hiragana', group: 'yoon', row: 'gya' },
  { char: 'ぎゅ', romaji: 'gyu', type: 'hiragana', group: 'yoon', row: 'gya' },
  { char: 'ぎょ', romaji: 'gyo', type: 'hiragana', group: 'yoon', row: 'gya' },

  { char: 'じゃ', romaji: 'ja', type: 'hiragana', group: 'yoon', row: 'ja' },
  { char: 'じゅ', romaji: 'ju', type: 'hiragana', group: 'yoon', row: 'ja' },
  { char: 'じょ', romaji: 'jo', type: 'hiragana', group: 'yoon', row: 'ja' },

  { char: 'びゃ', romaji: 'bya', type: 'hiragana', group: 'yoon', row: 'bya' },
  { char: 'びゅ', romaji: 'byu', type: 'hiragana', group: 'yoon', row: 'bya' },
  { char: 'びょ', romaji: 'byo', type: 'hiragana', group: 'yoon', row: 'bya' },

  { char: 'ぴゃ', romaji: 'pya', type: 'hiragana', group: 'yoon', row: 'pya' },
  { char: 'ぴゅ', romaji: 'pyu', type: 'hiragana', group: 'yoon', row: 'pya' },
  { char: 'ぴょ', romaji: 'pyo', type: 'hiragana', group: 'yoon', row: 'pya' }
];

export const KATAKANA_DATA: KanaCharacter[] = [
  // Gojuon
  { char: 'ア', romaji: 'a', type: 'katakana', group: 'gojuon', row: 'a' },
  { char: 'イ', romaji: 'i', type: 'katakana', group: 'gojuon', row: 'a' },
  { char: 'ウ', romaji: 'u', type: 'katakana', group: 'gojuon', row: 'a' },
  { char: 'エ', romaji: 'e', type: 'katakana', group: 'gojuon', row: 'a' },
  { char: 'オ', romaji: 'o', type: 'katakana', group: 'gojuon', row: 'a' },

  { char: 'カ', romaji: 'ka', type: 'katakana', group: 'gojuon', row: 'k' },
  { char: 'キ', romaji: 'ki', type: 'katakana', group: 'gojuon', row: 'k' },
  { char: 'ク', romaji: 'ku', type: 'katakana', group: 'gojuon', row: 'k' },
  { char: 'ケ', romaji: 'ke', type: 'katakana', group: 'gojuon', row: 'k' },
  { char: 'コ', romaji: 'ko', type: 'katakana', group: 'gojuon', row: 'k' },

  { char: 'サ', romaji: 'sa', type: 'katakana', group: 'gojuon', row: 's' },
  { char: 'シ', romaji: 'shi', type: 'katakana', group: 'gojuon', row: 's' },
  { char: 'ス', romaji: 'su', type: 'katakana', group: 'gojuon', row: 's' },
  { char: 'セ', romaji: 'se', type: 'katakana', group: 'gojuon', row: 's' },
  { char: 'ソ', romaji: 'so', type: 'katakana', group: 'gojuon', row: 's' },

  { char: 'タ', romaji: 'ta', type: 'katakana', group: 'gojuon', row: 't' },
  { char: 'チ', romaji: 'chi', type: 'katakana', group: 'gojuon', row: 't' },
  { char: 'ツ', romaji: 'tsu', type: 'katakana', group: 'gojuon', row: 't' },
  { char: 'テ', romaji: 'te', type: 'katakana', group: 'gojuon', row: 't' },
  { char: 'ト', romaji: 'to', type: 'katakana', group: 'gojuon', row: 't' },

  { char: 'ナ', romaji: 'na', type: 'katakana', group: 'gojuon', row: 'n' },
  { char: 'ニ', romaji: 'ni', type: 'katakana', group: 'gojuon', row: 'n' },
  { char: 'ヌ', romaji: 'nu', type: 'katakana', group: 'gojuon', row: 'n' },
  { char: 'ネ', romaji: 'ne', type: 'katakana', group: 'gojuon', row: 'n' },
  { char: 'ノ', romaji: 'no', type: 'katakana', group: 'gojuon', row: 'n' },

  { char: 'ハ', romaji: 'ha', type: 'katakana', group: 'gojuon', row: 'h' },
  { char: 'ヒ', romaji: 'hi', type: 'katakana', group: 'gojuon', row: 'h' },
  { char: 'フ', romaji: 'fu', type: 'katakana', group: 'gojuon', row: 'h' },
  { char: 'ヘ', romaji: 'he', type: 'katakana', group: 'gojuon', row: 'h' },
  { char: 'ホ', romaji: 'ho', type: 'katakana', group: 'gojuon', row: 'h' },

  { char: 'マ', romaji: 'ma', type: 'katakana', group: 'gojuon', row: 'm' },
  { char: 'ミ', romaji: 'mi', type: 'katakana', group: 'gojuon', row: 'm' },
  { char: 'ム', romaji: 'mu', type: 'katakana', group: 'gojuon', row: 'm' },
  { char: 'メ', romaji: 'me', type: 'katakana', group: 'gojuon', row: 'm' },
  { char: 'モ', romaji: 'mo', type: 'katakana', group: 'gojuon', row: 'm' },

  { char: 'ヤ', romaji: 'ya', type: 'katakana', group: 'gojuon', row: 'y' },
  { char: 'ユ', romaji: 'yu', type: 'katakana', group: 'gojuon', row: 'y' },
  { char: 'ヨ', romaji: 'yo', type: 'katakana', group: 'gojuon', row: 'y' },

  { char: 'ラ', romaji: 'ra', type: 'katakana', group: 'gojuon', row: 'r' },
  { char: 'リ', romaji: 'ri', type: 'katakana', group: 'gojuon', row: 'r' },
  { char: 'ル', romaji: 'ru', type: 'katakana', group: 'gojuon', row: 'r' },
  { char: 'レ', romaji: 're', type: 'katakana', group: 'gojuon', row: 'r' },
  { char: 'ロ', romaji: 'ro', type: 'katakana', group: 'gojuon', row: 'r' },

  { char: 'ワ', romaji: 'wa', type: 'katakana', group: 'gojuon', row: 'w' },
  { char: 'ヲ', romaji: 'wo', type: 'katakana', group: 'gojuon', row: 'w' },
  { char: 'ン', romaji: 'n', type: 'katakana', group: 'gojuon', row: 'w' },

  // Dakuon / Handakuon
  { char: 'ガ', romaji: 'ga', type: 'katakana', group: 'dakuon', row: 'g' },
  { char: 'ギ', romaji: 'gi', type: 'katakana', group: 'dakuon', row: 'g' },
  { char: 'グ', romaji: 'gu', type: 'katakana', group: 'dakuon', row: 'g' },
  { char: 'ゲ', romaji: 'ge', type: 'katakana', group: 'dakuon', row: 'g' },
  { char: 'ゴ', romaji: 'go', type: 'katakana', group: 'dakuon', row: 'g' },

  { char: 'ザ', romaji: 'za', type: 'katakana', group: 'dakuon', row: 'z' },
  { char: 'ジ', romaji: 'ji', type: 'katakana', group: 'dakuon', row: 'z' },
  { char: 'ズ', romaji: 'zu', type: 'katakana', group: 'dakuon', row: 'z' },
  { char: 'ゼ', romaji: 'ze', type: 'katakana', group: 'dakuon', row: 'z' },
  { char: 'ゾ', romaji: 'zo', type: 'katakana', group: 'dakuon', row: 'z' },

  { char: 'ダ', romaji: 'da', type: 'katakana', group: 'dakuon', row: 'd' },
  { char: 'ヂ', romaji: 'ji', type: 'katakana', group: 'dakuon', row: 'd' },
  { char: 'ヅ', romaji: 'zu', type: 'katakana', group: 'dakuon', row: 'd' },
  { char: 'デ', romaji: 'de', type: 'katakana', group: 'dakuon', row: 'd' },
  { char: 'ド', romaji: 'do', type: 'katakana', group: 'dakuon', row: 'd' },

  { char: 'バ', romaji: 'ba', type: 'katakana', group: 'dakuon', row: 'b' },
  { char: 'ビ', romaji: 'bi', type: 'katakana', group: 'dakuon', row: 'b' },
  { char: 'ブ', romaji: 'bu', type: 'katakana', group: 'dakuon', row: 'b' },
  { char: 'ベ', romaji: 'be', type: 'katakana', group: 'dakuon', row: 'b' },
  { char: 'ボ', romaji: 'bo', type: 'katakana', group: 'dakuon', row: 'b' },

  { char: 'パ', romaji: 'pa', type: 'katakana', group: 'dakuon', row: 'p' },
  { char: 'ピ', romaji: 'pi', type: 'katakana', group: 'dakuon', row: 'p' },
  { char: 'プ', romaji: 'pu', type: 'katakana', group: 'dakuon', row: 'p' },
  { char: 'ペ', romaji: 'pe', type: 'katakana', group: 'dakuon', row: 'p' },
  { char: 'ポ', romaji: 'po', type: 'katakana', group: 'dakuon', row: 'p' },

  // Yoon
  { char: 'キャ', romaji: 'kya', type: 'katakana', group: 'yoon', row: 'kya' },
  { char: 'キュ', romaji: 'kyu', type: 'katakana', group: 'yoon', row: 'kya' },
  { char: 'キョ', romaji: 'kyo', type: 'katakana', group: 'yoon', row: 'kya' },

  { char: 'シャ', romaji: 'sha', type: 'katakana', group: 'yoon', row: 'sha' },
  { char: 'シュ', romaji: 'shu', type: 'katakana', group: 'yoon', row: 'sha' },
  { char: 'ショ', romaji: 'sho', type: 'katakana', group: 'yoon', row: 'sha' },

  { char: 'チャ', romaji: 'cha', type: 'katakana', group: 'yoon', row: 'cha' },
  { char: 'チュ', romaji: 'chu', type: 'katakana', group: 'yoon', row: 'cha' },
  { char: 'チョ', romaji: 'cho', type: 'katakana', group: 'yoon', row: 'cha' },

  { char: 'ニャ', romaji: 'nya', type: 'katakana', group: 'yoon', row: 'nya' },
  { char: 'ニュ', romaji: 'nyu', type: 'katakana', group: 'yoon', row: 'nya' },
  { char: 'ニョ', romaji: 'nyo', type: 'katakana', group: 'yoon', row: 'nya' },

  { char: 'ヒャ', romaji: 'hya', type: 'katakana', group: 'yoon', row: 'hya' },
  { char: 'ヒュ', romaji: 'hyu', type: 'katakana', group: 'yoon', row: 'hya' },
  { char: 'ヒョ', romaji: 'hyo', type: 'katakana', group: 'yoon', row: 'hya' },

  { char: 'ミャ', romaji: 'mya', type: 'katakana', group: 'yoon', row: 'mya' },
  { char: 'ミュ', romaji: 'myu', type: 'katakana', group: 'yoon', row: 'mya' },
  { char: 'ミョ', romaji: 'myo', type: 'katakana', group: 'yoon', row: 'mya' },

  { char: 'リャ', romaji: 'rya', type: 'katakana', group: 'yoon', row: 'rya' },
  { char: 'リュ', romaji: 'ryu', type: 'katakana', group: 'yoon', row: 'rya' },
  { char: 'リョ', romaji: 'ryo', type: 'katakana', group: 'yoon', row: 'rya' },

  { char: 'ギャ', romaji: 'gya', type: 'katakana', group: 'yoon', row: 'gya' },
  { char: 'ギュ', romaji: 'gyu', type: 'katakana', group: 'yoon', row: 'gya' },
  { char: 'ギョ', romaji: 'gyo', type: 'katakana', group: 'yoon', row: 'gya' },

  { char: 'ジャ', romaji: 'ja', type: 'katakana', group: 'yoon', row: 'ja' },
  { char: 'ジュ', romaji: 'ju', type: 'katakana', group: 'yoon', row: 'ja' },
  { char: 'ジョ', romaji: 'jo', type: 'katakana', group: 'yoon', row: 'ja' },

  { char: 'ビャ', romaji: 'bya', type: 'katakana', group: 'yoon', row: 'bya' },
  { char: 'ビュ', romaji: 'byu', type: 'katakana', group: 'yoon', row: 'bya' },
  { char: 'ビョ', romaji: 'byo', type: 'katakana', group: 'yoon', row: 'bya' },

  { char: 'ピゃ', romaji: 'pya', type: 'katakana', group: 'yoon', row: 'pya' }, // Note: lowercase ゃ/ャ fix
  { char: 'ピュ', romaji: 'pyu', type: 'katakana', group: 'yoon', row: 'pya' },
  { char: 'ピョ', romaji: 'pyo', type: 'katakana', group: 'yoon', row: 'pya' }
];

export const ALL_KANA_DATA = [...HIRAGANA_DATA, ...KATAKANA_DATA];
