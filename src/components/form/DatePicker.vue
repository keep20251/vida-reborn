<template>
  <div class="relative w-fit rounded-2xl px-8 py-16 shadow-[1px_1px_5px_0px_rgba(0,0,0,0.1)]">
    <div class="flex h-44 space-x-16 py-16 pt-8">
      <div class="w-1/2 cursor-pointer px-8 pl-22" :class="{ disable: monthSelectOpen }" @click="toggleYearSelect">
        {{ yearSelect }}
      </div>
      <div class="w-1/2 cursor-pointer px-8 pl-22" :class="{ disable: yearSelectOpen }" @click="toggleMonthSelect">
        {{ $t(monthOptions[monthSelect]) }}
      </div>
    </div>
    <div
      class="absolute left-0 top-51 w-full origin-top scale-y-0 overflow-auto duration-150"
      :class="[selectOptionsHeightClass, { 'scale-y-100': yearSelectOpen || monthSelectOpen }]"
    >
      <div v-if="yearSelectOpen" class="bg-white">
        <div
          v-for="year in yearOptions"
          class="flex cursor-pointer px-10 py-16"
          :class="{ 'bg-primary': year === yearSelect }"
          :key="year"
          @click="setYear(year)"
        >
          <div class="w-38"><Icon v-if="year === yearSelect" size="16" name="emoji"></Icon></div>
          <div>{{ year }}</div>
        </div>
      </div>
      <div v-if="monthSelectOpen" class="bg-white">
        <div
          v-for="(monthKey, monthValue) in monthOptions"
          class="flex cursor-pointer px-10 py-16"
          :class="{ 'bg-primary': monthValue === monthSelect }"
          :key="monthValue"
          @click="setMonth(monthValue)"
        >
          <div class="w-38">
            <Icon v-if="monthValue === monthSelect" size="16" name="emoji"></Icon>
          </div>
          <div>{{ $t(monthKey) }}</div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-7">
      <div class="h-40 w-40 p-10 text-center font-normal leading-[140%]">S</div>
      <div class="h-40 w-40 p-10 text-center font-normal leading-[140%]">M</div>
      <div class="h-40 w-40 p-10 text-center font-normal leading-[140%]">T</div>
      <div class="h-40 w-40 p-10 text-center font-normal leading-[140%]">W</div>
      <div class="h-40 w-40 p-10 text-center font-normal leading-[140%]">T</div>
      <div class="h-40 w-40 p-10 text-center font-normal leading-[140%]">F</div>
      <div class="h-40 w-40 p-10 text-center font-normal leading-[140%]">S</div>
    </div>
    <div class="grid grid-cols-7">
      <div
        v-for="(date, i) in dateGrid"
        class="h-40 w-40 cursor-pointer rounded-[1.25rem] p-10 text-center text-base font-medium leading-[140%]"
        :class="{ 'bg-primary': date.selected, 'text-white': date.selected }"
        :key="i"
        @click="pickDate(date)"
      >
        {{ date.date }}
      </div>
    </div>
    <div v-if="includeTime">
      <div class="h-1 bg-gray36"></div>
      <div
        class="gap-row-8 mt-16 flex h-36 grow items-center divide-solid rounded-[1.125rem] border-gray20 bg-white px-20 py-12 text-sm font-normal not-italic leading-[0.75rem] text-gray66 shadow-[inset_0_-0.0625rem_0.5rem_0_rgba(0,0,0,0.1)] placeholder:text-gray36"
        :class="{ error: !!timeErr }"
      >
        <input
          v-model="time"
          type="text"
          class="h-30 w-full grow outline-none"
          @click="onTimeFocus"
          @blur="onTimeBlur"
        />
        <Icon size="20" name="calendar"></Icon>
      </div>
      <div v-if="timeErr" class="text-sm font-normal leading-[120%] text-warning">
        {{ timeErr }}
      </div>
    </div>
    <div class="flex h-56 justify-end space-x-8 px-8 py-12">
      <div class="weight-medium cursor-pointer px-10 py-12 text-base leading-[140%]" @click="cancel">Cancel</div>
      <div class="weight-medium cursor-pointer px-10 py-12 text-base leading-[140%]" @click="confirm">OK</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import padStart from 'lodash/padStart'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const props = defineProps({
  modelValue: { type: Date, required: true },
  includeTime: { type: Boolean, default: false },
})
const emits = defineEmits(['update:modelValue', 'close'])

const datePicked = ref(props.modelValue)
const yearSelect = ref(datePicked.value.getFullYear())
const monthSelect = ref(datePicked.value.getMonth())
function setYear(year) {
  yearSelect.value = year
  yearSelectOpen.value = false
}
function setMonth(month) {
  if (month >= 0 && month <= 11) {
    monthSelect.value = month
    monthSelectOpen.value = false
  } else {
    throw new Error(`month value '${month}' incorrectly...`)
  }
}
const yearOptions = ref(genYearOptions())
const monthOptions = ref([
  'month.Jan',
  'month.Feb',
  'month.Mar',
  'month.Apr',
  'month.May',
  'month.Jun',
  'month.Jul',
  'month.Aug',
  'month.Sep',
  'month.Oct',
  'month.Nov',
  'month.Dec',
])
const yearSelectOpen = ref(false)
const monthSelectOpen = ref(false)
function toggleYearSelect() {
  yearSelectOpen.value = !yearSelectOpen.value
  if (yearSelectOpen.value && monthSelectOpen.value) {
    monthSelectOpen.value = false
  }
}
function toggleMonthSelect() {
  monthSelectOpen.value = !monthSelectOpen.value
  if (monthSelectOpen.value && yearSelectOpen.value) {
    yearSelectOpen.value = false
  }
}

const dateGrid = computed(() => {
  const year = yearSelect.value
  const month = monthSelect.value
  const date = datePicked.value
  const firstDate = new Date(year, month, 1)
  const firstDateDay = firstDate.getDay()
  const r = []
  for (let i = 0, j = 0; i < firstDateDay; i++, j--) {
    const date = new Date(year, month, j)
    const [y, m, d] = [date.getFullYear(), date.getMonth(), date.getDate()]
    r.unshift({ year: y, month: m, date: d })
  }
  const lastDate = new Date(year, month + 1, 0)
  const lastDateDate = lastDate.getDate()
  for (let currDate = 1; currDate <= lastDateDate; currDate++) {
    r.push({
      year,
      month,
      date: currDate,
      selected: year === date.getFullYear() && month === date.getMonth() && currDate === date.getDate(),
    })
  }
  const lastDateDay = lastDate.getDay()
  for (let i = 0; i < 6 - lastDateDay; i++) {
    const date = new Date(year, month, lastDateDate + i + 1)
    const [y, m, d] = [date.getFullYear(), date.getMonth(), date.getDate()]
    r.push({ year: y, month: m, date: d })
  }

  return r
})
const selectOptionsHeightClass = computed(() => {
  // 一週7天 * 6行
  if (dateGrid.value.length === 7 * 6) {
    return 'h-[18.5rem]'
  }
  return 'h-[21rem]'
})

const timeErr = ref('')
const time = computed(() => {
  const h = datePicked.value.getHours()
  const m = datePicked.value.getMinutes()
  return padStart(h, 2, '0') + ' : ' + padStart(m, 2, '0')
})
function onTimeFocus(evt) {
  const input = evt.target
  const selectionIndex = input.selectionStart
  if (selectionIndex < 4) {
    input.setSelectionRange(0, 2)
  } else {
    input.setSelectionRange(5, 7)
  }
}
function onTimeBlur(evt) {
  const input = evt.target
  const originValue = time.value

  const [hours, minutes] = input.value.split(':')
  const hoursTrim = hours?.trim()
  const minutesTrim = minutes?.trim()
  const hoursInt = parseInt(hoursTrim)
  const minutesInt = parseInt(minutesTrim)

  if (/^[0-9]{1,2}$/.test(hoursTrim) && hoursInt < 24 && /^[0-9]{1,2}$/.test(minutesTrim) && minutesInt < 60) {
    const y = datePicked.value.getFullYear()
    const m = datePicked.value.getMonth()
    const d = datePicked.value.getDate()
    const seconds = datePicked.value.getSeconds()
    const ms = datePicked.value.getMilliseconds()
    datePicked.value = new Date(y, m, d, hoursInt, minutesInt, seconds, ms)
    timeErr.value = ''
  } else {
    input.value = originValue
    timeErr.value = $t('yup.time.format')
  }
}

function pickDate(date) {
  yearSelect.value = date.year
  monthSelect.value = date.month

  const hours = datePicked.value.getHours()
  const minutes = datePicked.value.getMinutes()
  const seconds = datePicked.value.getSeconds()
  const ms = datePicked.value.getMilliseconds()
  datePicked.value = new Date(date.year, date.month, date.date, hours, minutes, seconds, ms)
}

function cancel() {
  emits('close')
}

function confirm() {
  if (!timeErr.value) {
    emits('update:modelValue', datePicked.value)
    emits('close')
  }
}

function genYearOptions() {
  const currentYear = new Date().getFullYear()
  const startYear = 2023
  const yearArray = []

  for (let year = startYear; year <= currentYear; year++) {
    yearArray.push(year)
  }

  return yearArray
}
</script>
