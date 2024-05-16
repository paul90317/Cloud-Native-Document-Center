import authHandlers from './apis/auth'
import fileHandlers from './apis/file'
import imageHandlers from './apis/image'
import reviewHandlers from './apis/review'


const handlers = [
  ...authHandlers,
  ...fileHandlers,
  ...imageHandlers,
  ...reviewHandlers,
]

export default handlers