<template>
  <div class="border-t pt-20">
    <label class="text-base font-normal not-italic leading-md">{{ $t('title.prefer') }}： </label>
    <OptionsPicker v-model="interested" :options="options" class="!justify-start"></OptionsPicker>
    <div class="py-20 text-sm font-normal leading-3 text-gray-57">{{ $t('label.multiple') }}</div>
    <Button @click="savePref">{{ $t('common.save') }}</Button>
    <div v-if="!!serverError" class="text-sm font-normal leading-md text-warning">{{ serverError }}</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/account'
import { useMineStore } from '@/store/mine'
import Button from '@comp/common/Button.vue'
import OptionsPicker from '@comp/form/OptionsPicker.vue'
import useRequest from '@use/request/index.js'

const { t: $t } = useI18n()

const accountStore = useAccountStore()
const { userData } = accountStore

const mineStore = useMineStore()
const { interested } = storeToRefs(mineStore)

const options = ref([])

onMounted(() => {
  interested.value = userData.interested.split(',').map(Number)
  data()
})

const data = async () => {
  let categories
  try {
    categories = await useRequest('Article.categories', { immediate: true })

    // 將後端取得的 categories.list 轉換為 options 格式
    options.value = Object.entries(categories.list).map(([value, label]) => ({
      value: parseInt(value, 10),
      label: $t(`category.${value}`),
    }))
  } catch (e) {
    console.log(e)
  }
}

const serverError = ref('')
async function savePref() {
  const { execute } = useRequest('User.modifyInfo')
  try {
    await execute({})
    console.log('成功囉！')
  } catch (e) {
    serverError.value = e.message
    console.error(e)
  }
}
</script>
