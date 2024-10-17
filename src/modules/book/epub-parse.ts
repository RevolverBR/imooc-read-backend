import * as path from 'path';
import * as fs from 'fs';

// 需要引入adm-zip库，xml2js库:解析xml文件
import * as AdmZip from 'adm-zip';
import * as XmlJS from 'xml2js';
import * as fse from 'fs-extra'

import { NGINX_PATH1, NGINX_PATH2 } from '../../utils/const'
import { tmpdir } from 'os';

/**
 * 解压电子书
 * @param bookPath 文件路径
 * @param unzipPath 解压路径
 */
export function unzip(bookPath, unzipPath) {
  const zip = new AdmZip(bookPath);
  zip.extractAllTo(unzipPath, true);
}

export function parseRootFile(unzipPath) {
  // 找到文件路径
  const containerFilePath = path.resolve(unzipPath, 'META-INF/container.xml');
  const containerXml = fs.readFileSync(containerFilePath, 'utf-8');
  // containerXml <?xml version="1.0"?>
  // <container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  // <rootfiles>
  // <rootfile full-path="OEBPS/package.opf" media-type="application/oebps-package+xml" />
  // </rootfiles>
  // </container>
  // 将xml文件解析成promise对象
  const { parseStringPromise } = XmlJS;
  return parseStringPromise(containerXml, {
    // 不要封装成数组
    explicitArray: false,
  }).then((data) => {
    return data.container.rootfiles.rootfile['$']['full-path'];
  });
}

export function parseContentOpf(unzipPath, filePath) {
  const fullPath = path.resolve(unzipPath, filePath);
  const contentOpf = fs.readFileSync(fullPath, 'utf-8');
  // console.log(fullPath);
  // console.log(contentOpf);

  const { parseStringPromise } = XmlJS
  return parseStringPromise(contentOpf, {
    explicitArray: false
  }).then(async(data) => {
    // console.log(data)
    const { metadata } = data.package
    // console.log(metadata)
    const title = metadata['dc:title']
    const creator = metadata['dc:creator']['_']
    // console.log('creator', creator)
    const publisher = metadata['dc:publisher']
    const language = metadata['dc:language']
    const coverMeta = metadata.meta
    const coverId = metadata.meta["$"].content
    const manifest = data.package.manifest.item
    const coverRes = manifest.find(item => item['$'].id === coverId)
    const dir = path.dirname(fullPath)
    const cover = path.resolve(dir, coverRes['$'].href)
    const rootDir = path.dirname(filePath)
    // console.log('filePath', filePath)

    // console.log(title, creator, publisher, language, coverId)
    // console.log(dir)

    // 解析目录
    const content = await parseContent(dir, 'toc.ncx', rootDir)
    // console.log(content)
    return {
      title,
      creator,
      publisher,
      language,
      cover,
      content,
      rootFile: filePath
    }
  })
}


export async function parseContent(contentDir, contentFilePath, rootDir) {
  // console.log('rootDir', rootDir) OEBPS
  const contentPath = path.resolve(contentDir, contentFilePath)
  const contentXml = fs.readFileSync(contentPath, 'utf-8')
  const { parseStringPromise } = XmlJS
  const data = await parseStringPromise(contentXml, {
    explicitArray: false
  })
  const navMap = data.ncx.navMap.navPoint
  // console.log(data)
  // console.log('navMap', navMap)
  // console.log('navMap', navMap[0].content['$'])

  const navData = navMap.map((nav) => {
    const id = nav['$'].id
    const playOrder = +nav['$'].playOrder
    const text = nav.navLabel.text
    const href = nav.content['$'].src
    // console.log(text, href)
    return {
      id,
      playOrder,
      text,
      href: `${rootDir}/${href}`
    }
  })

  return navData
}

export function copyCoverImage(data, tmpDir) {
  const { cover } = data
  if (!cover) return

  const coverPathName = cover.replace(tmpDir, './')
  const coverDir = path.resolve(NGINX_PATH2, 'cover')
  const coverNewPath = path.resolve(coverDir, coverPathName)

  fse.mkdirpSync(coverDir)
  fse.copySync(cover, coverNewPath)
  // console.log(cover)
  // console.log(coverPathName)
  // console.log(coverDir)
  // console.log(coverNewPath)

  return coverNewPath
}

export function copyUnzipBook(tmpDir, dirName) {
  const bookDir = path.resolve(NGINX_PATH2, 'book', dirName)
  // 创建目录
  fse.mkdirpSync(bookDir)
  // 拷贝
  fse.copySync(tmpDir, bookDir)
}