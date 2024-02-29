class RandomTools {
  /**
   * @Author: ChenJF
   * @Date: 2024/2/28 19:23
   * @Description: 创建请求ID，32位长度
   */
  public static getRequestId(): string {
    return this.getRandomStr(32);
  }

  public static getRandomStr(length = 32): string {
    const $chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const maxPos = $chars.length;
    let id = '';
    let i = 0;
    for (i; i < length; i++) {
      id += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return id;
  }
}

export { RandomTools };
