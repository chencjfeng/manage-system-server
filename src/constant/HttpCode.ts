enum HttpCode {
  SUCCESS = 200,
  BAD_REQUEST = 400, // 参数校验不通过
  SIGNATURE_ERROR = 401, // 签名错误
  NOT_FOUND = 404, // 接口不存在
  NOT_METHOD = 405, // 接口方法不存在
}

export { HttpCode };
