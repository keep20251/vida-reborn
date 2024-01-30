<template>
  <div class="w-full">
    <div class="mb-10">Consent</div>
    <div
      class="scrollbar-md mb-30 h-[530px] min-h-[250px] space-y-2 overflow-y-scroll rounded-md bg-gray-f6 p-20 text-base font-normal leading-lg text-gray-57"
    >
      <p>IMPORTANT INFORMATION – PLEASE READ</p>
      <p>Verifying And Authenticating Your Age and Identity – Using Face Match Identification</p>
      <p>Overview:</p>
      <ul class="!list-disc pl-20">
        <li>
          If you would like to start a Creator account on VIDA, VIDA needs to: (i) verify your age; and (ii) verify and
          authenticate your identity. This is to ensure that all VIDA Creators are who they say there are, and are at
          least 18 years of age.
        </li>
        <li>
          VIDA can’t process your biometric data, for this purpose, without your consent. Ensuring online safety is a
          core value of VIDA. The age and identity checks VIDA carries out are critical to ensuring the safety of the
          VIDA community. Given its importance, please note that if you do not provide the personal data required to
          carry out the verification and authentication checks, you cannot start a Creator account on VIDA.
        </li>
        <li>
          Please ensure that you have read and understood this notice before proceeding. This notice provides important
          information relating to the age and identity verification, and authentication, process and the use of face
          match identification for these purposes.
        </li>
      </ul>
      <div class="pt-24">Consent for using face match identification</div>
      <ul class="!list-disc pl-20">
        <li>
          If you consent, we will receive and process your facial biometric data, collected through a “selfie”. With
          your consent, we will use facial biometric verification technology for the sole purpose of matching your face
          to the photo on your identity document, for age and identity verification and authentication, purposes.
        </li>
      </ul>
      <div class="pt-24">Data collected from your identity document</div>
      <ul class="!list-disc pl-20">
        <li>
          We will also receive and process personal data from the identity document that you provide, such as your name,
          surname, nationality, gender, date of birth, document number, date of issue, expiry date, and your signature.
        </li>
      </ul>
      <li>
        We carries out verification and authentication checks to ensure that your identity document is genuine, that
        your identity document belongs to you and that you are at least 18 years of age.
      </li>
      <li>
        Please note VIDA does not process the data collected from your identity document on the basis of your consent.
        Instead, it is necessary to perform our contract ( here ) with you. VIDA uses this information to help confirm
        who is using its products and services, for fraud detection and prevention purposes, and for legal purposes
        (including exercising VIDA’ legal rights and to make sure Creators and Fans are complying with the law in the
        countries where VIDA operates).
      </li>
      <div class="pt-24">Protection and retention</div>
      <ul class="!list-disc pl-20">
        <li>
          We uses reasonable physical, electronic, and procedural safeguards designed to protect biometric data it
          processes on VIDA’ behalf against loss or unauthorized access, use, modification, or deletion.
        </li>
      </ul>
      <li>VIDA does not receive or possess any facial biometric data generated from the images processed.</li>
      <li>
        VIDA will retain information received for a minimum of seven (7) years after a Creator closes their VIDA account
        to comply with record keeping and regulatory reporting requirements under applicable laws.
      </li>
      <div class="pt-24">More information and contacts</div>
      <ul class="!list-disc pl-20">
        <li>
          More information about how VIDA processes your personal data can be found in VIDA’ Privacy Policy ( here ) and
          the “Respecting Your Privacy” page on VIDA’ Safety and Transparency Centre ( here ).
        </li>
        <li>
          You can find out more information on why VIDA needs to carry out these identity verification and
          authentication checks on the “Age & Identity Verification” page on our online Safety and Transparency Centre (
          here ).
        </li>
        <li>If you have any questions, please contact privacy@VIDA.com.</li>
      </ul>
      <div class="pt-24">Your consent</div>
      <ul class="!list-disc pl-20">
        <li>
          By clicking “[ I agree ]” you understand and agree that: You consent to the collection and processing of your
          biometric facial data (i.e. matching this against the photo from your identity document) for the sole purpose
          of verifying your age, and verifying and authenticating your identity. You have read and understood the
          information contained in this notice.
        </li>
        <li>You are at least 18 years of age.</li>
        <li>
          The personal data you will provide for age and identity verification and authentication checks, is correct and
          up-to-date.
        </li>
        <li>The identity which you use for this purpose is authentic and valid.</li>
      </ul>
    </div>
    <ol class="mb-20 !list-decimal space-y-10 pl-20 text-base font-normal leading-lg text-gray-57">
      <li>Before you can upload your content or make money as an affiliate, <b>we need to verify your identity.</b></li>
      <li>This process takes <b>less than 5 minute</b> and is fully confidential.</li>
      <li>During this process, you will be asked to take pictures of you and your ID.</li>
      <li>Make sure your webcam <b>or phone camera</b> is working and you have your ID nearby.</li>
    </ol>
    <div class="text-center text-base font-normal leading-lg text-gray-a3">
      If something went wrong during this process you will be able to restart or continue verification from this page.
    </div>
    <p class="text-center text-base font-normal leading-lg text-gray-a3">
      You can also contact support by sending an email to
      <a class="text-gray-57" href="mail:support@vida.pub">support@vida.pub</a>
    </p>
    <Button @click="openSocialLinkDialog" class="my-30">Agree and next step</Button>
  </div>
</template>
<script setup>
import { useModalStore } from '@/store/modal'
import Button from '@comp/common/Button.vue'
import { MODAL_TYPE } from '@const'

const modalStore = useModalStore()
const { open } = modalStore

const openSocialLinkDialog = () => {
  open(MODAL_TYPE.APPLY_CREATOR_CERT, {
    size: 'lg',
    title: 'Choose document',
    confirmText: 'Next',
    confirmAction: () => {},
    showClose: true,
    showConfirm: false,
  })
}
</script>
