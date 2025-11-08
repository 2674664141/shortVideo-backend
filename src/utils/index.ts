// 全局工具函数文件，全局的所有工具函数都应该放在这里
import SparkMD5 from 'spark-md5'
import type { ChunkObject } from '../type'
import { ElMessage } from 'element-plus'
import { MESSAGE_DURATION } from '../constant'

interface MessageOption {
  type: 'success' | 'warning' | 'info' | 'error' | 'primary'
  message: string
  duration?: number
  showClose?: boolean
  center?: boolean
  onClose?: () => void
}

/**
 *  全局消息提示
 * @param option 消息配置
 * @returns
 */
export const message = (option: MessageOption) => {
  const defaultOption = {
    type: 'sucess',
    duration: MESSAGE_DURATION
  }
  option = {
    ...defaultOption,
    ...option
  }
  return ElMessage({
    ...option
  })
}

/**
 * 节流原理：在一定时间内，只能触发一次
 *
 * @param {Function} func 要执行的回调函数
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行
 * @return null
 */
export function throttle(func: Function, wait = 500, immediate = false) {
  let timer = null
  let flag = false
  if (immediate) {
    if (!flag) {
      flag = true
      // 如果是立即执行，则在wait毫秒内开始时执行
      func()
      timer = setTimeout(() => {
        flag = false
      }, wait)
    }
  } else if (!flag) {
    flag = true
    // 如果是非立即执行，则在wait毫秒内的结束处执行
    timer = setTimeout(() => {
      flag = false
      typeof func === 'function' && func()
    }, wait)
  }
}

export const debounce = (func: Function, wait = 500) => {
  let timer: any = null
  return (...args: any[]) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/** 
   @description 获取文件格式
  * @param {String}  fileName 文件名称字符串 
  * @return {String} fileType 文件格式
*/

export function getFileType(fileName: string) {
  const fileExtension = fileName.split('.').pop()?.toLowerCase()
  return fileExtension || ''
}

/**
 * 获取文件的名称
 * @param fullName 文件全名，不包含最后的扩展名
 * @returns
 */
export const getFileName = (fullName: string) => {
  return fullName.substring(0, fullName.lastIndexOf('.'))
}

/**
 * 解析视频时长
 * @param duration 视频时长，单位秒
 * @returns {String} 视频时长字符串
 */
export const parseVideoDuration = (duration: number) => {
  const hour = Math.floor(duration / 3600)
  const minute = Math.floor(duration / 60) % 60
  const second = Math.floor(duration) % 60
  if (hour > 0) {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second
      .toString()
      .padStart(2, '0')}`
  }
  return `${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
}

// export const parseCreatedTime = (time: Date) => {
//   const date = new Date(time)
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()
//   return `${year}-${month}-${day} ${hour}:${minute}:${second}`
// }

export const parseBirthdayToAge = (birthday?: string) => {
  if (!birthday) {
    return 0
  }
  const date = new Date(birthday)
  const now = new Date()
  const age = now.getFullYear() - date.getFullYear()
  return age
}

export const parsePublishTime = (time?: string) => {
  if (!time) {
    return ''
  }
  const publishDate = new Date(time)
  const current = Date.now()
  const seconds = Math.floor((current - publishDate.getTime()) / 1000)
  const month = publishDate.getMonth() + 1
  const days = publishDate.getDate()
  if (seconds < 60) {
    return '刚刚'
  }
  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}分钟前`
  }
  if (seconds < 86400) {
    return `${Math.floor(seconds / 3600)}小时前`
  }
  if (seconds < 604800) {
    return `${Math.floor(seconds / 86400)}天前`
  }
  return `${month.toString().padStart(2, '0')}-${days.toString().padStart(2, '0')}`
}

/**
 * 转换文件单位
 * @param size - 文件大小
 * @returns 文件大小字符串
 */
export const parseFileSize = (size: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let i = 0
  while (size >= 1024 && i < units.length) {
    size /= 1024
    i++
  }
  return `${size.toFixed(2)} ${units[i]}`
}

/**
 * 根据切片对象计算文件的哈希值
 * @param chunks 文件的所有切片
 * @param chunkSize 切片大小
 * @returns 文件的哈希值
 */
/**
 * 根据切片对象计算文件的哈希值（优化版）
 * 使用采样策略和并行处理提高大文件哈希计算性能
 * @param chunks 文件的所有切片
 * @param chunkSize 切片大小
 * @returns 文件的哈希值
 */
export const caculateHash = async (chunks: ChunkObject[], _chunkSize: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // 采样策略：只取部分切片进行哈希计算
      const sampleChunks: Blob[] = []

      // 始终包含第一个和最后一个切片
      if (chunks.length > 0) sampleChunks.push(chunks[0].blob)
      if (chunks.length > 1) sampleChunks.push(chunks[chunks.length - 1].blob)

      // 对于中间的切片，采样处理
      // 文件较小时（切片数<=10），取所有切片的头尾各2字节和中间2字节
      // 文件较大时，只取部分切片进行采样
      if (chunks.length <= 10) {
        // 小文件：对所有中间切片采样
        for (let i = 1; i < chunks.length - 1; i++) {
          const chunk = chunks[i].blob
          sampleChunks.push(chunk.slice(0, 2)) // 前2字节
          sampleChunks.push(chunk.slice(Math.floor(chunk.size / 2), Math.floor(chunk.size / 2) + 2)) // 中间2字节
          sampleChunks.push(chunk.slice(chunk.size - 2, chunk.size)) // 后2字节
        }
      } else {
        // 大文件：只取部分切片
        // 取第一个、最后一个、以及均匀分布的8个切片
        const step = Math.floor(chunks.length / 8)
        for (let i = 1; i < 8; i++) {
          const index = i * step
          if (index > 0 && index < chunks.length - 1) {
            const chunk = chunks[index].blob
            sampleChunks.push(chunk.slice(0, 4)) // 前4字节
            sampleChunks.push(
              chunk.slice(Math.floor(chunk.size / 2), Math.floor(chunk.size / 2) + 4)
            ) // 中间4字节
            sampleChunks.push(chunk.slice(chunk.size - 4, chunk.size)) // 后4字节
          }
        }
      }

      // 使用 SparkMD5 计算哈希
      const spark = new SparkMD5.ArrayBuffer()
      const fileReader = new FileReader()

      // 创建采样数据的Blob对象
      const sampleBlob = new Blob(sampleChunks)

      fileReader.onload = (e) => {
        if (e.target) {
          spark.append(e.target.result as ArrayBuffer)
          // 生成最终哈希值
          const hash = spark.end()
          resolve(hash)
        }
      }

      fileReader.onerror = (e) => {
        console.log(e)
        reject(new Error('文件读取失败'))
      }

      // 读取采样数据
      fileReader.readAsArrayBuffer(sampleBlob)
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * 切割文件成多个切片
 * @param file 要切割的文件
 * @param chunkSize 切片大小
 * @returns 文件的所有切片和哈希值
 */
export const cutFile = async (file: File, chunkSize: number = 1024 * 1024 * 2) => {
  const chunkCount = Math.ceil(file.size / chunkSize)
  const chunks: ChunkObject[] = []
  for (let i = 0; i < chunkCount; i++) {
    const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize)
    chunks.push({
      blob: chunk,
      index: i,
      hash: '',
      start: i * chunkSize,
      end: (i + 1) * chunkSize > file.size ? file.size : (i + 1) * chunkSize
    })
  }
  const hash = await caculateHash(chunks, chunkSize)
  chunks.forEach((chunk, index) => {
    chunk.hash = `${hash}-${index}`
  })
  return {
    chunks,
    hash
  }
}

/** 
   @description 扁平化数组
  * @param {Array}  array 要扁平化的数组
  * @return {string || function} 生成对象中key的函数
*/

type GenerateKeyFunction = (item: any, index: number, array: any[]) => string

export const flatArray = (array: Array<any>, generateKey: GenerateKeyFunction) => {
  if (!Array.isArray(array)) return
  if (typeof generateKey === 'string') {
    const key = generateKey
    generateKey = (item) => item[key]
  }
  const target: {
    [key: string]: Array<any>
  } = {}
  array.forEach((item, index) => {
    const key = generateKey(item, index, array)
    if (target[key]) {
      return target[key].push(item)
    }
    target[key] = [item]
  })
  return target
}
