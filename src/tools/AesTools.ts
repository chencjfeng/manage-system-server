import { RandomTools } from './RandomTools';
import CryptoJS from 'crypto-js';

interface ICryptData {
  iv: string; // iv
  data: string; // 加密内容
}
class AesTools {
  public static readonly BROWSER_SEC_KEY = 'BCJ9sS3CskRtzAJL3DZBLJHRQJCK5tfQ';
  public static readonly PASSWORD_SEC_KEY = 'P6gRUxw9g7pPzZhM3hCgSnXKgU4ZfyMH';
  public static readonly REDIS_SEC_KEY = 'Rcs4BWsmA8NJKDKhjHpAU4WGQ439ehLY';

  public static getObjData(data: string): ICryptData {
    const gapLength = 4;
    const preIV =
      data.substr(0, gapLength) + data.substr(2 * gapLength, gapLength);
    const preData =
      data.substr(gapLength, gapLength) + data.substr(3 * gapLength, gapLength);
    const middleData = data.substr(gapLength * 4, data.length - gapLength * 8);
    const endIV =
      data.substr(data.length - 4 * gapLength, gapLength) +
      data.substr(data.length - 2 * gapLength, gapLength);
    const endData =
      data.substr(data.length - 3 * gapLength, gapLength) +
      data.substr(data.length - gapLength, gapLength);
    const enData = preData + middleData + endData;
    const iv = preIV + endIV;
    return {
      iv,
      data: enData,
    };
  }

  public static concatStr(data: string, iv: string): string {
    const gapLength = 4;
    const pre =
      iv.substr(0, gapLength) +
      data.substr(0, gapLength) +
      iv.substr(gapLength, gapLength) +
      data.substr(gapLength, gapLength);
    const middle = data.substr(gapLength * 2, data.length - gapLength * 4);
    const end =
      iv.substr(gapLength * 2, gapLength) +
      data.substr(data.length - gapLength * 2, gapLength) +
      iv.substr(gapLength * 3, gapLength) +
      data.substr(data.length - gapLength, gapLength);
    return pre + middle + end;
  }

  /**
   * @Author: ChenJF
   * @Date: 2023/8/11 18:05
   * @Description: aes加密
   */
  public static encryptData(
    data: string,
    enKey: string = AesTools.BROWSER_SEC_KEY,
  ) {
    if (!data) {
      return '';
    }
    const iv = RandomTools.getRandomStr(16);
    // 加密选项
    const encryptOptions = {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    };
    const key = CryptoJS.enc.Utf8.parse(enKey);
    const secretData = CryptoJS.enc.Utf8.parse(data);
    const encrypted = CryptoJS.AES.encrypt(secretData, key, encryptOptions);
    const enData = encrypted.toString();
    return AesTools.concatStr(enData, iv);
  }

  /**
   * @Author: ChenJF
   * @Date: 2023/8/11 18:05
   * @Description: aes解密
   */
  public static decryptData(
    data: string,
    enKey: string = AesTools.BROWSER_SEC_KEY,
  ): string {
    if (!data) {
      return '';
    }
    const parseData = AesTools.getObjData(data);
    // 加密选项
    const decryptOptions = {
      iv: CryptoJS.enc.Utf8.parse(parseData.iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    };
    const key = CryptoJS.enc.Utf8.parse(enKey);
    const decrypt = CryptoJS.AES.decrypt(parseData.data, key, decryptOptions);
    try {
      const realData = CryptoJS.enc.Utf8.stringify(decrypt);
      if (realData) {
        return String(realData);
      }
      return '';
    } catch (e) {
      console.error('[decryptData]', '解密失败');
      console.error(e);
      return '';
    }
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/3/4 15:59
   * @Description: 生成会话token
   */
  public static encryptToken(loginName: string) {
    const token = this.encryptData(loginName, this.REDIS_SEC_KEY);
    return token.replace('+', '-').replace('/', '_');
  }

  /**
   * @Author: ChenJF
   * @Date: 2024/3/4 15:59
   * @Description: 解密会话token
   */
  public static decryptToken(token: string) {
    const newToken = token.replace('-', '+').replace('_', '/');
    return this.decryptData(newToken, this.REDIS_SEC_KEY);
  }
}

export { AesTools };
