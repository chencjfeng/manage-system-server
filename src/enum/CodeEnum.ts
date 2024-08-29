enum CodeEnum {
  SUCCESS = 0, // 成功
  COMMON = -1, // 通用错误码
  COMMON_PARAMS_ERROR = 1, // 参数错误,
  DB_SELECT_ID_EMPTY = 11, // 数据库查询数据空
  DB_INSERT_ERROR = 10, // 数据库插入错误
  DB_UPDATE_ERROR = 12, // 数据库更新错误
  DB_DELETE_ERROR = 13, // 数据库删除错误
  LOGIN_USERNAME_ERROR = 100, // 登录用户不存在
  LOGIN_PASSWORD_VERIFY_ERROR = 102, // 登录密码校验失败
  LOGIN_COMMON_ERROR = 103, // 登录失败
  LOGIN_USER_DISABLE_ERROR = 104, // 用户被禁用
  USER_PASSWORD_ERROR = 120, // 用户密码解密失败（空置）
  USER_LOGIN_NAME_SAME = 121, // 登录名相同
  USER_LOGIN_PASSWORD_ERROR = 122, // 密码错误
  USER_DELETE_EMPTY_ERROR = 123, // 删除用户不存在
  USER_DELETE_DEFAULT_ERROR = 124, // 系统用户，无法删除
  USER_EDIT_EMPTY_ERROR = 125, // 编辑用户不存在
  USER_EDIT_SUPER_ADMIN_ERROR = 126, // 超级管理员禁止编辑
  USER_EDIT_PASSWORD_ERROR = 127, // 密码错误
}

const CodeMsgEnum = {
  DB_SELECT_ID_EMPTY: '数据库查询id不存在',
  DB_INSERT_ERROR: '数据库插入失败',
  DB_UPDATE_ERROR: '数据库更新失败',
  DB_DELETE_ERROR: '数据库删除失败',
  COMMON_PARAMS_ERROR: '请求参数不符合要求，请检查参数', // 参数错误,
  LOGIN_USERNAME_ERROR: '登录名或密码错误', // 登录用户不存在 - 统一提示账号或密码错误
  LOGIN_PASSWORD_VERIFY_ERROR: '登录名或密码错误', // 登录密码校验失败 - 统一提示账号或密码错误
  LOGIN_COMMON_ERROR: '登录失败，请重试',
  LOGIN_USER_DISABLE_ERROR: '该用户处于禁止登录状态',
  USER_PASSWORD_ERROR: '用户密码解密失败，请检测参数',
  USER_LOGIN_NAME_SAME: '用户创建失败，已存在相同登录名用户',
  USER_LOGIN_PASSWORD_ERROR: '确认密码错误，请重新输入',
  USER_DELETE_EMPTY_ERROR: '删除用户失败：删除的用户不存在',
  USER_DELETE_DEFAULT_ERROR: '删除用户失败：系统用户无法删除',
  USER_EDIT_EMPTY_ERROR: '编辑用户失败：编辑的用户不存在',
  USER_EDIT_SUPER_ADMIN_ERROR: '编辑用户失败：超级管理员禁止编辑',
  USER_EDIT_PASSWORD_ERROR: '编辑用户密码失败：旧密码错误',
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
