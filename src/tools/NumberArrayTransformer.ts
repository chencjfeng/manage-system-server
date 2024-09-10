import { ValueTransformer } from 'typeorm';

export class NumberArrayTransformer implements ValueTransformer {
  // 从数据库读取数据时调用
  to(value: number[]): string {
    return value ? value.join(',') : '';
  }

  // 写入数据库时调用
  from(value: string[]): number[] {
    return value ? value.map(Number) : [];
  }
}
