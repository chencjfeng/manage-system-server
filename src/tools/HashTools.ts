import crypto from 'crypto';

class HashTools {
  public static sha256(str: string): string {
    return crypto.createHash('SHA256').update(str).digest('hex');
  }
}

export { HashTools };
