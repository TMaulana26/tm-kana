export interface ProgressBackup {
  nickname: string;
  progress: any;
}

export interface ImportResult {
  success: boolean;
  progressData?: ProgressBackup;
  error?: string;
  fileNickname?: string;
}

/**
 * Encodes progress data and nickname to a Base64 string.
 * Supports UTF-8/Unicode characters (e.g. Japanese nickname 'ユーザー').
 */
export function exportProgress(nickname: string, progressData: any): string {
  const payload: ProgressBackup = {
    nickname: nickname.trim(),
    progress: progressData
  };
  
  const jsonStr = JSON.stringify(payload);
  // Safe Base64 encoding for Unicode
  const utf8Bytes = encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  });
  
  return btoa(utf8Bytes);
}

/**
 * Decodes progress from Base64 string and validates it against current nickname (case-insensitive).
 */
export function importProgress(base64Str: string, currentNickname: string): ImportResult {
  try {
    const trimmedBase64 = base64Str.trim().replace(/\s/g, '');
    
    // Decode Base64 safely for Unicode
    const decodedBytes = atob(trimmedBase64);
    const jsonStr = decodeURIComponent(
      Array.prototype.map.call(decodedBytes, (c: string) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );
    
    const parsed = JSON.parse(jsonStr) as ProgressBackup;
    
    // Schema validation
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'invalid_format' };
    }
    
    if (typeof parsed.nickname !== 'string' || !parsed.progress || typeof parsed.progress !== 'object') {
      return { success: false, error: 'invalid_schema' };
    }
    
    // Case-insensitive nickname validation
    const fileNickname = parsed.nickname.trim().toLowerCase();
    const activeNickname = currentNickname.trim().toLowerCase();
    
    if (fileNickname !== activeNickname) {
      return { success: false, error: 'nickname_mismatch', fileNickname: parsed.nickname };
    }
    
    return {
      success: true,
      progressData: parsed
    };
  } catch {
    return {
      success: false,
      error: 'decryption_failed'
    };
  }
}
