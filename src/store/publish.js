import { CanceledError } from 'axios'
import imageCompression from 'browser-image-compression'
import { computed, reactive, readonly, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { defineStore, storeToRefs } from 'pinia'
import { useAppStore } from '@/store/app'
import { FEED_PERM, IMAGE_LIMIT_COUNT, MEDIA_TYPE, UPLOAD_STATUS } from '@/constant/publish'
import uploadImage from '@/http/upload/uploadImage'
import uploadMultipart from '@/http/upload/uploadMultipart'
import uploadVideo from '@/http/upload/uploadVideo'

// 使用者所選的檔案
// https://developer.mozilla.org/en-US/docs/Web/API/File
let fileList = null

// 上傳過程中被中段的 callback
const cnacelUploadFnList = []

const compressOptions = {
  maxSizeMB: 3,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
}

const DEFAULT_PUBLISH_PARAMS = {
  // 新增的話為null，修改的話為該帖子id
  id: null,

  category: null,
  title: '',
  content: '',
  tags: [],
  type: null,
  perm: FEED_PERM.SUB,
  subs: [],
  price: '',

  // 排定發布時間
  postTime: null,
}

export const usePublishStore = defineStore('publish', () => {
  const idMaker = (function* () {
    let id = 0
    while (true) {
      yield id++
    }
  })()

  const { t: $t } = useI18n()

  const startEditTimestamp = ref(null)

  const publishParams = reactive({ ...DEFAULT_PUBLISH_PARAMS })

  // 陣列中元素會是 video 和 image
  // 不會 video 和 image 交錯出現
  // video 的話只會有一個
  // image 可能會有多個
  //
  // video
  // {
  //   id, file, progress, status, failMsg, // from setFile
  //   objectUrl,                           // from videoObjectUrlExtract
  //   width, height, duration,             // from videoPropertyExtract
  //   url,                                 // from videoUpload
  // }
  //
  // image
  // {
  //   id, file, progress, status, failMsg, // from setFile
  //   compressedFile,                      // from imageCompress
  //   width, height, result,               // from imagePropertyExtract
  //   url,                                 // from imageUpload
  // }
  const uploadFiles = ref([])
  const noUploadFiles = computed(() => uploadFiles.value.length === 0)

  const isCreate = computed(() => publishParams.id === null)
  const isUpdate = computed(() => publishParams.id !== null)

  const isVideo = computed(() => publishParams.type === MEDIA_TYPE.VIDEO)
  const isImage = computed(() => publishParams.type === MEDIA_TYPE.IMAGE)

  const isEditing = computed(() => startEditTimestamp.value !== null)
  const isUploading = computed(() =>
    uploadFiles.value.some((f) => f.status !== UPLOAD_STATUS.DONE && f.status !== UPLOAD_STATUS.SAVE),
  )

  const publishTimeOpen = computed({
    get() {
      return publishParams.postTime !== null
    },
    set(v) {
      publishParams.postTime = v ? new Date() : null
    },
  })

  const appStore = useAppStore()
  const { categories } = storeToRefs(appStore)

  function setFile(files) {
    checkFileType(files)

    fileList = files

    for (const file of files) {
      pushUploadFile(file)
    }

    publishParams.category = categories.value[0].value

    startEditTimestamp.value = new Date().getTime()
  }

  function changeVideoFile(files, videoRef) {
    const firstFileType = files[0].type
    const feedType = getMediaType(firstFileType)
    if (feedType !== MEDIA_TYPE.VIDEO) {
      throw new Error($t('content.onlyChangeVideo'))
    }

    fileList = files

    uploadFiles.value = []

    pushUploadFile(files[0])

    startUpload(videoRef)
  }

  function addImageFile(files) {
    for (const file of files) {
      if (getMediaType(file.type) !== MEDIA_TYPE.IMAGE) {
        throw new Error($t('content.onlyAddImage'))
      }
    }

    for (const file of files) {
      pushUploadFile(file)
    }

    startUpload()
  }

  function pushUploadFile(file) {
    if (uploadFiles.value.length === IMAGE_LIMIT_COUNT) {
      return
    }
    uploadFiles.value.push({
      id: idMaker.next().value,
      file,
      progress: 0,
      status: UPLOAD_STATUS.PENDING,
      failMsg: null,
    })
  }

  function pushSavedFile(url, width, height) {
    uploadFiles.value.push({
      id: idMaker.next().value,
      progress: 1,
      status: UPLOAD_STATUS.SAVE,
      failMsg: null,
      url,
      width,
      height,
    })
  }

  function checkFileType(files) {
    const firstFileType = files[0].type
    const feedType = getMediaType(firstFileType)

    if (feedType === MEDIA_TYPE.VIDEO && files.length > 1) {
      throw new Error($t('content.videoLimitOne'))
    }

    if (feedType === MEDIA_TYPE.IMAGE) {
      for (let i = 1; i < files.length; i++) {
        if (getMediaType(files[i].type) !== MEDIA_TYPE.IMAGE) {
          throw new Error($t('content.imageVideoNotMix'))
        }
      }
    }

    publishParams.type = feedType
  }

  function getMediaType(type) {
    switch (type) {
      case 'video/mp4':
      case 'video/quicktime':
      case 'video/x-quicktime':
      case 'video/mov':
      case 'video/x-mov':
      case 'video/avi':
        return MEDIA_TYPE.VIDEO
      case 'image/jpg':
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
        return MEDIA_TYPE.IMAGE
      default:
        throw new Error($t('content.uploadVideoLimit.format', { format: type }))
    }
  }

  function toUpdate({ id, category, title, content, tags, type, perm, subs, price, postTime, urls }) {
    publishParams.id = id
    publishParams.category = category
    publishParams.title = title
    publishParams.content = content
    publishParams.tags = tags
    publishParams.type = type
    publishParams.perm = perm
    publishParams.subs = subs
    publishParams.price = price
    publishParams.postTime = postTime

    if (type === MEDIA_TYPE.VIDEO) {
      const { url, width, height } = urls[0]
      pushSavedFile(url, width, height)
    }

    if (type === MEDIA_TYPE.IMAGE) {
      for (const { url, width, height } of urls) {
        pushSavedFile(url, width, height)
      }
    }

    startEditTimestamp.value = new Date().getTime()
    // console.log(publishParams)
    // console.log(uploadFiles)
  }

  function getUploadPayload() {
    return {
      fileList,
    }
  }

  async function startUpload(videoRef) {
    if (isVideo.value) {
      await preprocessing(uploadFiles.value[0])
        .then(videoObjectUrlExtract)
        .then(videoPropertyExtract(videoRef))
        .then(videoUpload(onCancelUpload))
    }

    if (isImage.value) {
      await Promise.all(
        uploadFiles.value
          .filter((uploadFile) => uploadFile.status === UPLOAD_STATUS.PENDING)
          .map((uploadFile) =>
            preprocessing(uploadFile).then(imageCompress).then(imagePropertyExtract).then(imageUpload),
          ),
      )
    }
  }

  function removeUploadFile(id) {
    const index = uploadFiles.value.findIndex((uf) => uf.id === id)
    if (index !== -1) {
      uploadFiles.value.splice(index, 1)
    }
  }

  function reUploadFile(id) {
    const index = uploadFiles.value.findIndex((uf) => uf.id === id)
    if (index !== -1) {
      const uploadFile = uploadFiles.value[index]
      if (uploadFile.status === UPLOAD_STATUS.FAIL) {
        if (isImage.value) {
          preprocessing(uploadFile).then(imageCompress).then(imagePropertyExtract).then(imageUpload)
        }
      }
    }
  }

  function onCancelUpload(fn) {
    cnacelUploadFnList.push(fn)
  }

  function cancelUpload() {
    cnacelUploadFnList.forEach((cancel) => cancel())
  }

  function clear() {
    startEditTimestamp.value = null
    uploadFiles.value = []

    for (const [key, value] of Object.entries(DEFAULT_PUBLISH_PARAMS)) {
      publishParams[key] = value
    }

    fileList = null

    cnacelUploadFnList.length = 0

    cancelUpload()
  }

  return {
    startEditTimestamp: readonly(startEditTimestamp),

    uploadFiles,
    noUploadFiles,

    publishParams,
    isCreate,
    isUpdate,
    isVideo,
    isImage,
    isEditing,
    isUploading,
    publishTimeOpen,

    setFile,
    toUpdate,
    getUploadPayload,
    startUpload,
    changeVideoFile,
    addImageFile,
    removeUploadFile,
    reUploadFile,
    cancelUpload,
    clear,
  }
})

function preprocessing(uploadFile) {
  return new Promise((resolve, reject) => {
    uploadFile.status = UPLOAD_STATUS.PREPROCESSING
    resolve(uploadFile)
  })
}

function videoObjectUrlExtract(uploadFile) {
  return new Promise((resolve, reject) => {
    uploadFile.objectUrl = URL.createObjectURL(uploadFile.file)
    resolve(uploadFile)
  })
}

function videoPropertyExtract(videoRef) {
  return (uploadFile) =>
    new Promise((resolve, reject) => {
      const videoEle = videoRef.value
      videoEle.src = uploadFile.objectUrl
      videoEle.muted = true
      videoEle.onloadedmetadata = () => {
        const { videoWidth, videoHeight, duration } = videoEle
        uploadFile.width = videoWidth
        uploadFile.height = videoHeight
        uploadFile.duration = duration
        resolve(uploadFile)
      }
    })
}

const VIDEO_SIZE_THRESHOLD = 50 * 1024 * 1024

function videoUpload(onCancel) {
  return (uploadFile) => {
    return new Promise((resolve, reject) => {
      const uploader = uploadFile.file.size < VIDEO_SIZE_THRESHOLD ? uploadVideo : uploadMultipart
      uploadFile.status = UPLOAD_STATUS.UPLOADING
      uploader(
        uploadFile.file,
        (p, m) => {
          uploadFile.progress = p
          uploadFile.progressMsg = m
        },
        onCancel,
      )
        .then(({ publicUrl, uploadName }) => {
          uploadFile.status = UPLOAD_STATUS.DONE
          uploadFile.url = uploadName
          resolve(uploadFile)
        })
        .catch((err) => {
          if (err instanceof CanceledError) {
            return
          }
          uploadFile.status = UPLOAD_STATUS.FAIL
          uploadFile.failMsg = err.message
        })
    })
  }
}

function imageCompress(uploadFile) {
  return new Promise((resolve, reject) => {
    imageCompression(uploadFile.file, compressOptions)
      .then((compressedFile) => {
        console.log(`image compressed size ${compressedFile.size / 1024 / 1024} MB`)
        uploadFile.compressedFile = compressedFile
        resolve(uploadFile)
      })
      .catch((err) => {
        uploadFile.status = UPLOAD_STATUS.FAIL
        uploadFile.failMsg = 'content.processFail'
        console.error(err)
      })
  })
}

function imagePropertyExtract(uploadFile) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = function () {
      const temp = new Image()
      temp.src = fr.result
      temp.onload = () => {
        uploadFile.width = temp.width
        uploadFile.height = temp.height
        uploadFile.result = fr.result
        resolve(uploadFile)
      }
    }
    fr.onerror = function (evt) {
      uploadFile.status = UPLOAD_STATUS.FAIL
      uploadFile.failMsg = 'content.processFail'
      console.error(evt)
    }
    fr.readAsDataURL(uploadFile.compressedFile)
  })
}

function imageUpload(uploadFile) {
  return new Promise((resolve, reject) => {
    uploadFile.status = UPLOAD_STATUS.UPLOADING
    uploadImage(uploadFile.compressedFile, (p) => (uploadFile.progress = p))
      .then((url) => {
        uploadFile.status = UPLOAD_STATUS.DONE
        uploadFile.url = url
        resolve(uploadFile)
      })
      .catch((err) => {
        uploadFile.status = UPLOAD_STATUS.FAIL
        uploadFile.failMsg = err.message
      })
  })
}
