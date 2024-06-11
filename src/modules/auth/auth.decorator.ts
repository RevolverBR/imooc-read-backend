// 设置标识公共接口
import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)