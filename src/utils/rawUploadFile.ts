type UploadChangeFile = File & { originFileObj?: File }

/**
 * 从 a-upload 的 change 事件取出原始文件。
 * before-upload 返回 false 时，file 本身就是 File，没有 originFileObj。
 */
export function rawUploadFile(info: { file?: UploadChangeFile }) {
  const file = info.file
  if (!file) {
    return undefined
  }
  if (file.originFileObj instanceof File) {
    return file.originFileObj
  }
  if (file instanceof File) {
    return file
  }
  return undefined
}
