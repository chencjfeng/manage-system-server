import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CodeEnum } from '../../enum/CodeEnum';

/**
 * @Author: ChenJF
 * @Date: 2024/10/16 14:19
 * @Description: 登录日志
 */
@Entity('login_log')
class LoginLogEntity {
  constructor(log?: Partial<LoginLogEntity>) {
    if (log) {
      Object.assign(this, log);
    }
  }

  // id
  @PrimaryGeneratedColumn({ name: 'id' })
  id?: number;

  // 登录名
  @Column({ name: 'login_name' })
  loginName: string;

  // 来源IP
  @Column({ name: 'src_ip' })
  srcIp: string;

  // 请求体
  @Column({ name: 'req_body' })
  reqBody: string;

  // 是否登录成功
  @Column({
    name: 'login_status',
    enum: CodeEnum,
    type: 'enum',
    default: CodeEnum.SUCCESS,
  })
  loginStatus: CodeEnum;

  // 登录信息
  @Column({ name: 'login_msg' })
  loginMsg: string;

  // 登录时间
  @CreateDateColumn({ name: 'login_time', update: false })
  loginTime?: string;
}

export { LoginLogEntity };
