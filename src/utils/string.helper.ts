import { v4 as uuidv4 } from 'uuid';

/** 判断一个字符串是否为空或全空白 */
export const isNullOrWhitespace = (input: string | null | undefined) => {
  return !input || !input.trim();
};

/** 检查一个字符串是否是绝对路径的URL */
export const isUrl = (text: string) => {
  try {
    const url = new URL(text);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (error) {
    return false;
  }
};

/** 生成一个uuid字符串 */
export const uuid = () => {
  return uuidv4();
};