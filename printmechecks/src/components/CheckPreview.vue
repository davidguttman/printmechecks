<script setup lang="ts">
import type { CheckData } from '../types/check'

defineProps<{
  check: CheckData
  formatMoney: (value: string) => string
  toWords: (value: number | string) => string
}>()
</script>

<template>
  <div class="check-box">
    <div class="check-box-print">
      <div class="account-header">
        <div v-if="check.companyLogo" class="company-logo">
          <img :src="check.companyLogo" alt="Company logo">
        </div>
        <div class="account-holder-info">
          <div class="account-holder-name">{{ check.accountHolderName }}</div>
          <div class="account-holder-address">
            {{ check.accountHolderAddress }}<br>
            {{ check.accountHolderCity }}, {{ check.accountHolderState }} {{ check.accountHolderZip }}
          </div>
        </div>
      </div>
      <div class="check-number-human" style="position: absolute; top: 40px; left: 1060px">{{ check.checkNumber }}</div>
      <div class="date-data" style="position: absolute; top: 80px; left: 850px">{{ check.date }}</div>
      <div class="date" style="position: absolute; top: 90px; left: 760px">Date: _____________________</div>
      <div class="amount-box" style="position: absolute; top: 175px; left: 950px" />
      <div class="amount-data" style="position: absolute; top: 182px; left: 970px">{{ formatMoney(check.amount) }}</div>
      <div class="pay-to-data" style="position: absolute; top: 180px; left: 180px">{{ check.payTo }}</div>
      <div class="pay-to" style="position: absolute; top: 170px; left: 60px">
        Pay to the <br>Order of <span class="payto-line" />
      </div>
      <div class="amount-line-data" style="position: absolute; top: 240px; left: 100px">
        ***
        {{ toWords(check.amount) }}
        ***
      </div>
      <div class="amount-line" style="position: absolute; top: 250px; left: 60px">
        <span class="dollar-line" />
      </div>
      <div class="bank-name" style="position: absolute; top: 300px; left: 60px">{{ check.bankName }}</div>
      <div class="memo-data" style="position: absolute; top: 385px; left: 120px">{{ check.memo }}</div>
      <div class="memo" style="position: absolute; top: 390px; left: 60px">
        Memo: ____________________________________
      </div>
      <div class="signature-data" style="position: absolute; top: 366px; left: 770px">
        <img
          v-if="check.signatureSvg"
          :src="check.signatureSvg"
          alt="Signature"
          class="signature-image"
        />
        <template v-else>
          {{ check.signature }}
        </template>
      </div>
      <div class="signature" style="position: absolute; top: 390px; left: 750px">
        _________________________________________________
      </div>
      <div class="banking" style="position: absolute; top: 420px; left: 80px">
        <div class="routing" style="display: inline;">
          a{{ check.routingNumber }}a
        </div>
        <div class="bank-account" style="display: inline;">{{ check.bankAccountNumber }}c</div>
        <div class="check-number" style="display: inline; margin-left: 20px">{{ check.checkNumber }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.memo-data {
  font-size: 24px;
  max-width: 350px;
  line-height: 0.65;
}
.account-header {
  position: absolute;
  top: 40px;
  left: 60px;
  display: flex;
  gap: 20px;
  align-items: flex-start;
}
.account-holder-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.signature-data {
  font-family: Caveat;
  font-size: 40px;
  transform: rotate(-2deg);
}
.signature-image {
  max-width: 260px;
  max-height: 80px;
  object-fit: contain;
}
.company-logo {
  display: flex;
  align-items: center;
  max-width: 200px;
  max-height: 80px;
}
.company-logo img {
  max-height: 80px;
  width: auto;
  max-width: 100%;
  object-fit: contain;
}
.amount-line-data {
  text-transform: capitalize;
}
.date-data,
.pay-to-data,
.amount-data {
  font-size: 20px;
  font-weight: bold;
}
.bank-name {
  font-size: 20px;
  font-weight: bold;
}
.account-holder-name {
  font-size: 20px;
  font-weight: bold;
}
.check-number-human {
  font-size: 20px;
  font-weight: bold;
}
.amount-box::before {
  content: '$';
  font-size: 20px;
  margin-left: -15px;
  font-weight: bold;
}
.amount-box {
  width: 225px;
  height: 40px;
  border: 1px solid #c7c7c7;
  background-color: white;
}
.check-box {
  width: 1200px;
  height: 1553px;
  border: 1px solid #e6e6e6;
  background-color: white;
  margin: 0 auto;
  background: url('../assets/checkbg.png');
  background-repeat: no-repeat;
  background-size: contain;
}

.check-box-print {
  position: relative;
}

@font-face {
  font-family: 'banking';
  src: url('../assets/micrenc.ttf');
}

.banking {
  font-family: 'banking';
  font-size: 37px;
}
.dollar-line::after {
  content: 'Dollars';
  font-size: 18px;
  position: absolute;
  right: -73px;
  top: 0;
}
.dollar-line {
  width: 840px;
  display: block;
  border-bottom: 1px solid black;
  margin-left: 10px;
  margin-top: 20px;
}
.payto-line {
  width: 776px;
  display: block;
  border-bottom: 1px solid black;
  margin-left: 73px;
  border-right: 1px solid black;
  height: 28px;
  margin-top: -32px;
}
</style>
