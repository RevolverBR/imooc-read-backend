// 图书模型

import * as path from 'path'
import * as os from 'os'
import * as fse from 'fs-extra'
import { parseRootFile, unzip, parseContentOpf, copyCoverImage, copyUnzipBook } from './epub-parse'

const TEMP_PATH = '.vben/tmp-book'

export default class EpubBook {
  // 定义图书属性
  private bookPath: any
  private file: any
  private fileName: string
  private size: number
  private originalName: string

  constructor(bookPath, file) {
    this.bookPath = bookPath;
    this.file = file;
    this.fileName = file.originalname
    this.size = file.size
    this.originalName = file.originalname
  }

  // 需要第三方库fs-extra
  async parse() {
    // 13-3
    // 1.生成临时文件
    // 当前用户的主目录路径 C:\Users\admin
    // homeDir: C:\Users\admin
    // tmpDir: C:\Users\admin\.vben\tmp-book
    // tmpFile: C:\Users\admin\.vben\tmp-book\2010_Book_AccountabilityInPublicPolicyPa.epub
    const homeDir = os.homedir()
    const tmpDir = path.resolve(homeDir, TEMP_PATH)
    const tmpFile = path.resolve(tmpDir, this.fileName)

    /**
     * 同步复制文件
     * this.bookPath 源文件路径
     * tmpFile 目标文件路径
     */
    fse.copySync(this.bookPath, tmpFile)

    // 2.epub电子书解析
    // 生成解压文件夹
    // tmpUnzipDirName: 2010_Book_AccountabilityInPublicPolicyPa
    // tmpUnzipDir: C:\Users\admin\.vben\tmp-book\2010_Book_AccountabilityInPublicPolicyPa
    const tmpUnzipDirName = this.fileName.replace('.epub', '')
    const tmpUnzipDir = path.resolve(tmpDir, tmpUnzipDirName)

    // 同步创建目录C:\Users\admin\.vben\tmp-book\2010_Book_AccountabilityInPublicPolicyPa
    fse.mkdirpSync(tmpUnzipDir)

    // this.bookPath: D:\epub\2010_Book_AccountabilityInPublicPolicyPa.epub
    // tmpUnzipDir: C:\Users\admin\.vben\tmp-book\2010_Book_AccountabilityInPublicPolicyPa
    unzip(tmpFile, tmpDir)

    // 3.epub root file解析
    const rootFile = await parseRootFile(tmpUnzipDir)
    // console.log('rootFile', rootFile)

    // 4.epub content opf解析
    const bookData = await parseContentOpf(tmpUnzipDir, rootFile)

    // 5.拷贝电子书封面
    const cover = copyCoverImage(bookData, tmpDir)
    bookData.cover = cover

    // 6.拷贝解压后电子书
    copyUnzipBook(tmpUnzipDir, tmpUnzipDirName)

    // 7.删除文件，无需担心目录是否为空
    fse.removeSync(tmpFile)
    fse.removeSync(tmpUnzipDir)

    return bookData
  }
}