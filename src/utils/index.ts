// 用于线上服务器数据库获取信息更安全的方式，当前没有使用
import * as os from 'os'
import * as fs from 'fs'
import * as path from 'path'

export function getMysqlUsernameAndPassword() {
  const homedir = os.homedir()
  const usernamePath = path.resolve(homedir, '.vben', 'username')
  const passwordPath = path.resolve(homedir, '.vben', 'password')
  const username = fs.readFileSync(usernamePath).toString()
  const password = fs.readFileSync(passwordPath).toString()

  return {
    username,
    password
  }
}

// 请求成功的方法
export function success(data, msg) {
  return {
    code: 0,
    result: data,
    message: msg
  }
}

// 请求成功的方法
export function successCount(data, count, msg) {
  return {
    code: 0,
    result: data,
    message: msg,
    count
  }
}

// 请求error
export function error(msg) {
  return {
    code: -1,
    message: msg
  }
}

// 封装request p:promis
export function wrapperResponse(p, msg) {
  return p
  .then((data) => success(data, msg))
  .catch((err) => error(err.message))
}

export function wrapperCountResponse(dataPromise, countPromise, msg) {
  return Promise.all([dataPromise, countPromise])
  .then(res => {
    const [data, countArr] = res
    const  [count] = countArr
    return successCount(data, count.count, msg)
  }).catch(err => error(err.message))
}