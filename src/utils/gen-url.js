import { MEDIA_TYPE } from '@/constant/publish'

export function genShareFeedUrl(feed) {
  const username = feed.author?.username
  const mediaType = feed.type === MEDIA_TYPE.VIDEO ? 'video' : feed.type === MEDIA_TYPE.IMAGE ? 'photo' : feed.type
  const mediaId = feed.id
  return `${location.origin}/@${username}/${mediaType}/${mediaId}`
}

export function genCreatorPageUrl(username) {
  return `${location.origin}/${username}`
}
