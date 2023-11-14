import { useOauth } from '@/compositions/utils/oauth'

/**
 *  配合後端每個封包都要填上
 *
 *  oauth_id
 *  oauth_type
 *  version
 *
 *  這三個欄位
 *  雖然他叫做 oauth
 *  但是我覺得他比較像 device...XD
 */
export default function (request) {
  const { oauthId, oauthType, version } = useOauth()

  request.data = {
    ...request.data,

    oauth_id: oauthId.value,
    oauth_type: oauthType.value,
    version: version.value,
  }

  // console.log(request)

  return request
}
