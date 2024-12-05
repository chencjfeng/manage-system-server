enum ResourceTypeEnum {
  LAPTOP = 'LAPTOP',
  DESKTOP_COMPUTER = 'DESKTOP_COMPUTER',
  MONITOR = 'MONITOR',
  TELEPHONE = 'TELEPHONE',
  UNKNOWN_TYPE = 'UNKNOWN_TYPE',
}

enum ResourceTypeStringEnum {
  LAPTOP = '笔记本电脑',
  DESKTOP_COMPUTER = '台式电脑',
  MONITOR = '显示器',
  TELEPHONE = '电话',
  UNKNOWN_TYPE = '未知类型设备',
}

const resourceTypeEnumToString = (type: ResourceTypeEnum): string => {
  const findKey = Object.keys(ResourceTypeEnum).find(
    (key) => ResourceTypeEnum[key as keyof typeof ResourceTypeEnum] === type,
  );
  return findKey
    ? ResourceTypeStringEnum[findKey as keyof typeof ResourceTypeStringEnum]
    : '';
};

export { ResourceTypeEnum, ResourceTypeStringEnum, resourceTypeEnumToString };
