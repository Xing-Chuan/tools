const SELF_HELP_URL = 'https://safe.woniu.com/callcenter/self_help.html';
const SUPPORT_URL = 'https://support.woniu.com/';

const services = [
  {
    id: 'phone',
    icon: '手',
    title: '换绑手机',
    caption: '更新安全手机号',
    url: SELF_HELP_URL,
    steps: ['确认旧手机号或准备身份核验材料', '进入“安全自助”中的手机修改', '按官网提示完成验证', '确认新号码可正常接收通知'],
    notice: '请只在官方页面输入验证信息；本工具不输入密码、不保存验证码。',
  },
  {
    id: 'email',
    icon: '信',
    title: '换绑邮箱',
    caption: '更新安全邮箱',
    url: SELF_HELP_URL,
    steps: ['准备可正常收信的新邮箱', '进入“安全自助”中的邮箱修改', '在官方页面完成邮箱验证', '检查新邮箱的验证邮件'],
    notice: '完成后建议立即测试新邮箱是否能收到官方邮件。',
  },
  {
    id: 'password',
    icon: '锁',
    title: '修改密码',
    caption: '更新通行证密码',
    url: SELF_HELP_URL,
    steps: ['确认当前账号可通过安全验证', '进入“账号、密码自助”中的修改密码', '设置未在其他站点使用过的新密码', '在密码管理器中更新记录'],
    notice: '不要将密码、验证码或密保答案发送给任何人，包括本工具。',
  },
  {
    id: 'security-card',
    icon: '盾',
    title: '密保卡',
    caption: '绑定、换绑或解绑',
    url: SELF_HELP_URL,
    steps: ['确认本次是申请、绑定、更换还是解绑', '进入“密保卡自助”', '按官网指引完成身份验证', '妥善保存密保卡，不要截图外传'],
    notice: '密保卡属于高敏感信息，建议优先在远程 PC 或实体电脑上操作。',
  },
  {
    id: 'ticket',
    icon: '单',
    title: '提交工单',
    caption: '人工协助与问题反馈',
    url: SUPPORT_URL,
    steps: ['整理账号归属与问题发生时间', '准备订单号、角色信息或相关截图', '在客服中心选择对应问题分类', '保存工单编号，等待官方回复'],
    notice: '截图前请遮盖身份证号、完整手机号、密码和验证码。',
  },
];

export function getServices() {
  return services.map((service) => ({ ...service, steps: [...service.steps] }));
}

export function getService(id) {
  return services.find((service) => service.id === id);
}

export function isSafeExternalUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (url.hostname === 'safe.woniu.com' || url.hostname === 'support.woniu.com');
  } catch {
    return false;
  }
}
