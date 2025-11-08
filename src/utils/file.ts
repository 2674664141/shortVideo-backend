import { mergeChunksAPI, uploadChunkAPI } from '@/api/video'
import type { ChunkObject } from '@/type'
import { cutFile, getFileType } from '.'

/**
 * 上传文件切片
 * @param chunk 文件切片
 * @param fileHash 文件哈希值
 * @returns 上传文件切片后的响应
 */
const uploadChunk = (chunk: ChunkObject, fileHash: string, fileType: string) => {
  const formData = new FormData()
  formData.append('fileHash', fileHash)
  formData.append('chunkHash', chunk.hash)
  formData.append('fileType', fileType)
  formData.append('chunk', chunk.blob)
  return uploadChunkAPI(formData)
}

/**
 * 上传文件的所有切片
 * @param chunks 文件所有切片
 * @param fileHash 文件哈希值
 * @returns
 */
export const uploadChunks = async (
  chunks: ChunkObject[],
  fileHash: string,
  fileType: string,
  onProgress: (percent: number) => void
) => {
  const taskList: Promise<any>[] = []
  let index = 0
  let completed = 0
  while (index < chunks.length) {
    const task = uploadChunk(chunks[index], fileHash, fileType)
    taskList.push(task)
    task
      .then(() => {
        completed++
        const progress = ((completed / chunks.length) * 100).toFixed(2)
        onProgress(+progress)
      })
      .finally(() => {
        taskList.splice(taskList.indexOf(task), 1)
      })
    if (taskList.length >= 3) {
      await Promise.race(taskList)
    }
    index++
  }
  return await Promise.all(taskList)
}

/**
 * 合并文件的所有切片
 * @param fileName 文件名字
 * @param fileHash 文件哈希值
 * @param chunkSize 切片大小
 * @returns 合并后的响应值
 */
export const mergeChunks = (
  fileName: string,
  fileHash: string,
  fileType: string,
  mimeType: string,
  chunkSize: number
) => {
  return mergeChunksAPI({
    fileName: fileName,
    fileHash: fileHash,
    chunkSize: chunkSize,
    fileType: fileType,
    mimeType: mimeType
  })
}

/**
 * 上传单个文件
 * @param file 文件
 * @returns
 */
export const uploadFile = async (file: File, onProgress: (percent: number) => void) => {
  const { chunks, hash } = await cutFile(file)
  await uploadChunks(chunks, hash, file.type.split('/')[0], onProgress)
  return await mergeChunks(
    file.name,
    hash,
    getFileType(file.name),
    file.type.split('/')[0],
    1024 * 1024 * 2
  )
}

/**
 * 下载文件
 * @param data 要下载的文件数据
 * @param fileName 文件名字
 */
export const autoDownload = (data: Blob | MediaSource, fileName: string) => {
  const mediaData = URL.createObjectURL(data)
  const link = document.createElement('a')
  link.href = mediaData
  link.download = fileName
  link.click()
  link.remove()
  URL.revokeObjectURL(mediaData)
}

export const directDownload = (data: string, fileName: string) => {
  const link = document.createElement('a')
  link.href = data
  link.download = fileName
  link.click()
  link.remove()
}

export const base64ToFile = (base64Data: string, filename: string, mimeType: string) => {
  // 移除Base64前缀（如果有）
  const base64WithoutPrefix = base64Data.split(';base64,').pop()
  if (!base64WithoutPrefix) {
    return null
  }
  // 将Base64字符串转换为字节数组
  const byteCharacters = atob(base64WithoutPrefix)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512)
    const byteNumbers = new Array(slice.length)

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  // 创建Blob对象并转换为File对象
  const blob = new Blob(byteArrays, { type: mimeType })
  return new File([blob], filename, { type: mimeType })
}
