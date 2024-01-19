<template>
  <Page>
    <template #main-top>
      <Tab v-model="tab" :options="tabOptions"></Tab>
    </template>
    <template #default>
      <div v-if="tab === 1" class="my-10 grid space-y-20 px-20">
        <div>【 Input Text | Password | Number 】</div>
        <InputWrap v-model="inputValue" :label="'帳號'" :sublabel="'(必填)'" :errMsg="'帳號不得為空'"></InputWrap>

        <InputWrap
          v-model="inputValue"
          :label="'Price'"
          :sublabel="'单位：美金'"
          :placeholder="'9.99'"
          :appendText="'最高设置为90元'"
          :maxLength="5"
        ></InputWrap>

        <InputWrap
          v-model="inputValue"
          :placeholder="`輸入您的連結...`"
          :prependIcon="'link'"
          :appendIcon="'bin'"
          @click:append="console.log('appendIcon')"
        ></InputWrap>

        <InputWrap
          v-model="inputValue"
          :placeholder="'Add new tag...'"
          :appendTextBtn="'Add'"
          @click:append="console.log('appendTextBtn')"
        ></InputWrap>

        <InputWrap
          v-model="inputValue"
          :placeholder="'Add new tag...'"
          :appendIconBtn="'sendWhite'"
          @click:append="console.log('appendIconBtn')"
        ></InputWrap>

        <InputWrap v-model="inputValue" :label="'密碼'" :placeholder="'輸入您的密碼'" password></InputWrap>

        <p class="text-sm">輸入的值：{{ inputValue }}</p>
        <hr />

        <div>【 Textarea 】</div>
        <TextareaWrap
          v-model="textareaValue"
          :label="'标题'"
          :sublabel="'(副标题)'"
          :placeholder="'填写内文'"
          :errMsg="'錯誤訊息'"
        ></TextareaWrap>
        <p class="text-sm">輸入的值：{{ textareaValue }}</p>
        <hr />

        <div>【 Input Radio 】</div>
        <InputRadio
          disabled
          v-model="selectedValue"
          id="radioOption1"
          label="Option radio 1"
          value="radio1"
          name="radio"
        />
        <InputRadio v-model="selectedValue" id="radioOption2" label="Option radio 2" value="radio2" name="radio" />
        <InputRadio v-model="selectedValue" id="radioOption3" label="Option radio 3" value="radio3" name="radio" />
        <p class="text-sm">選擇的值：{{ selectedValue }}</p>
        <hr />

        <div>【 Input Switch 】</div>
        <InputSwitch :label="'選取切換'" v-model="switchValue"></InputSwitch>
        <p class="text-sm">選擇的值：{{ switchValue }}</p>
      </div>
      <div v-else-if="tab === 2" class="my-10 grid space-y-20 px-20">
        <div>【 Text Style 】</div>
        <div class="text-xl font-bold leading-[1.5625rem]">Helvetica Neue-25-特重标题</div>
        <div class="leading-lg text-lg font-bold">Helvetica Neue-18-大标题</div>
        <div class="leading-lg text-base font-normal">Helvetica Neue-14-正文</div>
        <div class="text-sm font-normal leading-3">＠Helvetica Neue-12-注释</div>
        <div class="text-base font-bold leading-md">Helvetica Neue-14-按钮</div>
        <div class="text-base font-normal leading-md">Helvetica Neue-14-按钮未选中</div>
      </div>
      <div v-else-if="tab === 3" class="my-10 grid space-y-20 px-20">
        <div>【 Dropdown 】</div>
        <div class="flex flex-col gap-16 p-8">
          <Dropdown class="w-96" v-model="dropdownValue" :options="options"></Dropdown>
          <Dropdown v-model="dropdownValue" :options="options" inset></Dropdown>
        </div>
        <div>【 Accordion 】</div>
        <div class="flex flex-col space-y-5 p-8">
          <Accordion :accordions="myAccordionData"></Accordion>
        </div>
      </div>
      <div v-else-if="tab === 4" class="my-10 grid space-y-20 px-20">
        <div>【 Button 】</div>
        <div class="mb-8">
          <Button @click="onBtnClick('primary button')">primary button</Button>
        </div>
        <div class="mb-8">
          <Button @click="onBtnClick('contrast button')" contrast>contrast button</Button>
        </div>
        <div class="mb-8">
          <Button @click="onBtnClick('gradient button')" gradient>gradient button</Button>
        </div>
        <div class="flex space-x-8">
          <Button @click="onBtnClick('cancel button')" cancel>cancel button</Button>
          <Button @click="onBtnClick('confirm button')">confirm button</Button>
        </div>
        <div class="flex space-x-8">
          <Button loading>loading button</Button>
        </div>
      </div>
      <div v-else-if="tab === 5" class="my-10 grid space-y-20 px-20">
        <div>【 OptionsPicker 】</div>
        <OptionsPicker v-model="singlePickedOption" :options="options"></OptionsPicker>
        <p class="text-sm">單選的值：{{ singlePickedOption }}</p>
        <OptionsPicker v-model="multiplePickedOptions" :options="options"></OptionsPicker>
        <p class="text-sm">多選的值：{{ multiplePickedOptions }}</p>
        <hr />
        <div>【 DatePicker 】</div>
        <DatePicker v-model="datePicked" include-time></DatePicker>
        <p class="text-sm">日期的值：{{ datePicked.toLocaleString() }}</p>
      </div>
    </template>
  </Page>
</template>

<script setup>
import { ref } from 'vue'
import InputWrap from '@comp/form/InputWrap.vue'
import InputRadio from '@comp/form/InputRadio.vue'
import InputSwitch from '@comp/form/InputSwitch.vue'
import OptionsPicker from '@comp/form/OptionsPicker.vue'
import DatePicker from '@comp/form/DatePicker.vue'
import Dropdown from '@comp/form/Dropdown.vue'
import Accordion from '@comp/common/Accordion.vue'
import TextareaWrap from '@comp/form/TextareaWrap.vue'
import Button from '@comp/common/Button.vue'
import Tab from '@comp/navigation/Tab.vue'

const tab = ref(1)
const tabOptions = ref([
  { label: 'Input', value: 1 },
  { label: 'Text', value: 2 },
  { label: 'Dropdown', value: 3 },
  { label: 'Button', value: 4 },
  { label: 'Picker', value: 5 },
])

const inputValue = ref('')
const textareaValue = ref('')
const selectedValue = ref('radio2')
const switchValue = ref(true)

const dropdownValue = ref(1)

const singlePickedOption = ref(1)
const multiplePickedOptions = ref([1])
const options = ref([
  { label: 'Option1', value: 1 },
  { label: 'Option2', value: 2 },
  { label: 'Option3', value: 3 },
  { label: 'Option4', value: 4 },
  { label: 'Option5', value: 5 },
  { label: 'Option6', value: 6 },
  { label: 'Option7', value: 7 },
  { label: 'Option8', value: 8 },
  { label: 'Option9', value: 9 },
  { label: 'Option10', value: 10 },
])

const myAccordionData = [
  {
    title: '帳號',
    open: true,
    content: [
      {
        subTitle: '我忘記密碼了',
        open: false,
        subContent: '前往登入畫面，並在密碼欄位中點擊‘忘記’。如果您不再記得您的電子郵件地址，請聯繫support@vida',
      },
      {
        subTitle: '如何刪除我的帳號？',
        open: true,
        subContent: '請注意，刪除帳號是一個不可逆轉的過程，您的所有資料將根據我們的隱私政策永久刪除。',
      },
    ],
  },
  {
    title: '功能',
    open: false,
    content: [
      {
        subTitle: '為什麼我要訂閱？',
        open: false,
        subContent:
          '作為訂閱者，您將根據您所關注和訂閱的類別和創作者收到高度個性化的內容。您不僅可以訪問創作者的私人內容，還有獨家機會與他們互動、直接傳訊和交談！',
      },
      {
        subTitle: '如何將內容發送給創作者？',
        open: false,
        subContent:
          '訂閱者可以與創作者分享媒體。內容必須符合社群指南。在與創作者進行消息對話時，您只需按下聊天框旁邊的回形針按鈕，然後從您的設備上傳圖片或視頻。',
      },
      {
        subTitle: '內容是否保存在用戶個人資料中以供將來上傳？',
        open: false,
        subContent: '不，內容不會保存。每次您希望將內容發送給創作者時，內容都需要從您的設備上傳。',
      },
    ],
  },
  {
    title: '聯繫',
    open: false,
    content: [
      {
        subTitle: '如何聯繫Fantasi客戶支持？',
        open: false,
        subContent:
          '我們很樂意幫助您解答問題。若要直接與我們聯繫，請使用以下鏈接和聯絡信息：一般與網站支持：support@Fantasi、帳單支持：support@Fantasi 或訪問 https: //www.Fantasi （僅限帳單相關）',
      },
    ],
  },
]

const datePicked = ref(new Date())

function onBtnClick(v) {
  console.log(v)
}
</script>
