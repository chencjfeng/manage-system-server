enum CodeEnum {
  SUCCESS = 0, // 成功
  COMMON = -1, // 通用错误码
  COMMON_PARAMS_ERROR = 1, // 参数错误,
  LOGIN_USERNAME_ERROR = 10, // 登录用户不存在
  LOGIN_PASSWORD_ERROR = 11, // 登录密码解密失败
  LOGIN_PASSWORD_VERIFY_ERROR = 12, // 登录密码校验失败
}

const CodeMsgEnum = {
  COMMON_PARAMS_ERROR: '请求参数不符合要求，请检查参数', // 参数错误,
  LOGIN_USERNAME_ERROR: '登录名或密码错误', // 登录用户不存在 - 统一提示账号或密码错误
  LOGIN_PASSWORD_ERROR: '登录名或密码错误', // 登录密码解密失败 - 统一提示账号或密码错误
  LOGIN_PASSWORD_VERIFY_ERROR: '登录名或密码错误', // 登录密码校验失败 - 统一提示账号或密码错误
};

const codeEnumToString = (code: CodeEnum): string => {
  let value = '服务器在尝试处理请求时发生内部错误，请联系管理员处理';
  const findKey = Object.keys(CodeEnum).find(
    (key) => CodeEnum[key as keyof typeof CodeEnum] === code,
  );
  if (findKey) {
    const msg = CodeMsgEnum[findKey as keyof typeof CodeMsgEnum];
    if (msg) {
      value = msg;
    }
  }
  return `${value}[code: ${code}]`;
};

export { CodeEnum, CodeMsgEnum, codeEnumToString };
