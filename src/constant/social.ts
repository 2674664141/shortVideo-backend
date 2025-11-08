// 表情包相关常量
export const EMOJI_LIST = [
  {
    id: 1,
    name: '表情1',
    file: 'img1.png',
    type: 'png'
  },
  {
    id: 2,
    name: '表情2',
    file: 'img2.png',
    type: 'png'
  },
  {
    id: 3,
    name: '表情3',
    file: 'img3.png',
    type: 'png'
  },
  {
    id: 4,
    name: '表情4',
    file: 'img4.png',
    type: 'png'
  },
  {
    id: 5,
    name: '表情5',
    file: 'img5.png',
    type: 'png'
  },
  {
    id: 6,
    name: '表情6',
    file: 'img6.png',
    type: 'png'
  },
  {
    id: 7,
    name: '表情7',
    file: 'img7.png',
    type: 'png'
  },
  {
    id: 8,
    name: '表情8',
    file: 'img8.png',
    type: 'png'
  },
  {
    id: 9,
    name: '表情9',
    file: 'img9.png',
    type: 'png'
  }
]
export const EMOJI_BASE_PATH = 'http://localhost:5173/biaoqing/'

export const EMOJI_LIST_MAP = EMOJI_LIST.reduce((acc, cur) => {
  acc[cur.name] = EMOJI_BASE_PATH + cur.file
  return acc
}, {} as Record<string, string>)

// 表情包路径 - 确保路径以斜杠结尾
