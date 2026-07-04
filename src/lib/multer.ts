import crypto from 'node:crypto'
import path from 'node:path'
import multer from 'multer'

// pasta onde as imagens serão salvas — resolve o caminho a partir da raiz do projeto
const UPLOADS_FOLDER = path.resolve('uploads')

export const upload = multer({
  storage: multer.diskStorage({
    // define onde o arquivo será salvo no disco
    destination: UPLOADS_FOLDER,

    filename(_, file, callback) {
      // gera 10 bytes aleatórios e converte para hex para evitar nomes duplicados
      const hash = crypto.randomBytes(10).toString('hex')

      // nome final: hash + nome original (ex: a3f8c2d1e4b7-foto.png)
      const fileName = `${hash}-${file.originalname}`

      // callback(erro, nomeDoArquivo) — null significa sem erro
      callback(null, fileName)
    },
  }),

  limits: {
    // limita o tamanho máximo do arquivo a 3MB
    fileSize: 1024 * 1024 * 3,
  },

  fileFilter(_, file, callback) {
    // tipos de imagem aceitos
    const allowed = ['image/jpeg', 'image/jpg', 'image/png']

    if (!allowed.includes(file.mimetype)) {
      // rejeita o arquivo se o tipo não for permitido
      return callback(new Error('Only JPEG and PNG images are allowed'))
    }

    // aceita o arquivo
    callback(null, true)
  },
})
