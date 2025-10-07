<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ToWords } from 'to-words'
import CheckPreview from '../components/CheckPreview.vue'
import { useAppStore } from '../stores/app'
import {
  addDays,
  cloneCheck,
  createDefaultCheck,
  formatDate,
  formatMoney,
  parseDateString,
  loadBatchTemplate,
  saveBatchTemplate
} from '../utilities'
import type { CheckData } from '../types/check'

const WEEK_INTERVAL_DAYS = 7
const DEFAULT_COUNT = 12

const state = useAppStore()
const router = useRouter()

const storedBatchTemplate = loadBatchTemplate()
const initialTemplate = state.batchTemplate
  ? cloneCheck(state.batchTemplate)
  : storedBatchTemplate ?? createDefaultCheck()

const baseCheck = ref<CheckData>(initialTemplate)
const checkCount = ref<number>(DEFAULT_COUNT)

const toWordsTool = new ToWords({
  localeCode: 'en-US',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: true
  }
})

const toWords = (denom: number | string): string => {
  try {
    return toWordsTool.convert(Number(denom))
  } catch (error) {
    return String(error)
  }
}

const generatedChecks = computed<CheckData[]>(() => {
  const results: CheckData[] = []
  const template = baseCheck.value
  const quantity = Math.max(1, Number.isFinite(checkCount.value) ? checkCount.value : DEFAULT_COUNT)
  const parsedNumber = Number.parseInt(template.checkNumber, 10)
  const baseDate = parseDateString(template.date)

  for (let index = 0; index < quantity; index += 1) {
    const next = cloneCheck(template)

    if (!Number.isNaN(parsedNumber)) {
      next.checkNumber = String(parsedNumber + index)
    }

    if (baseDate) {
      const nextDate = addDays(baseDate, index * WEEK_INTERVAL_DAYS)
      next.date = formatDate(nextDate)
    }

    results.push(next)
  }

  return results
})

function printBatch(): void {
  const style = document.createElement('style')
  style.textContent = `
    @media print {
      @page {
        margin: 0;
      }
      body {
        margin: 0;
        padding: 0;
        background: white;
      }
      #app > .container:first-of-type,
      .batch-controls {
        display: none !important;
      }
      #app > .container:last-of-type {
        width: 100% !important;
        max-width: none !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .batch-wrapper {
        padding: 0 !important;
        margin: 0 !important;
      }
      .batch-print-area {
        gap: 0 !important;
        padding: 0 !important;
      }
      .batch-print-area .check-box {
        page-break-after: always;
        break-after: page;
        background: white !important;
        background-image: none !important;
        box-shadow: none !important;
      }
      .batch-print-area .check-box:last-of-type {
        page-break-after: auto;
      }
    }
  `
  document.head.appendChild(style)
  window.print()
  style.remove()
}

function goBack(): void {
  state.check = cloneCheck(baseCheck.value)
  router.push('/')
}

onMounted(() => {
  state.batchTemplate = null
  saveBatchTemplate(baseCheck.value)
})

watch(
  baseCheck,
  (value) => {
    saveBatchTemplate(value)
  },
  { deep: true }
)
</script>

<template>
  <main class="batch-wrapper">
    <div class="batch-controls card">
      <div class="card-body">
        <h1 class="h4">Batch Print</h1>
        <p class="text-muted">Generate weekly checks with incrementing numbers.</p>
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label" for="batch-check-number">First check number</label>
            <input
              id="batch-check-number"
              v-model="baseCheck.checkNumber"
              type="text"
              class="form-control"
            >
          </div>
          <div class="col-md-3">
            <label class="form-label" for="batch-check-date">First check date</label>
            <input
              id="batch-check-date"
              v-model="baseCheck.date"
              type="text"
              class="form-control"
            >
          </div>
          <div class="col-md-3">
            <label class="form-label" for="batch-count">Number of checks</label>
            <input
              id="batch-count"
              v-model.number="checkCount"
              type="number"
              min="1"
              max="52"
              class="form-control"
            >
          </div>
          <div class="col-md-3">
            <label class="form-label" for="batch-amount">Amount</label>
            <input
              id="batch-amount"
              v-model="baseCheck.amount"
              type="text"
              class="form-control"
            >
          </div>
        </div>
        <div class="row g-3" style="margin-top: 20px;">
          <div class="col-md-6">
            <label class="form-label" for="batch-payee">Pay to</label>
            <input
              id="batch-payee"
              v-model="baseCheck.payTo"
              type="text"
              class="form-control"
            >
          </div>
          <div class="col-md-6">
            <label class="form-label" for="batch-memo">Memo</label>
            <input
              id="batch-memo"
              v-model="baseCheck.memo"
              type="text"
              class="form-control"
            >
          </div>
          <div class="col-md-6">
            <label class="form-label" for="batch-account-holder-name">Account holder name</label>
            <input
              id="batch-account-holder-name"
              v-model="baseCheck.accountHolderName"
              type="text"
              class="form-control"
            >
          </div>
          <div class="col-md-6">
            <label class="form-label" for="batch-account-holder-address">Address</label>
            <input
              id="batch-account-holder-address"
              v-model="baseCheck.accountHolderAddress"
              type="text"
              class="form-control"
            >
          </div>
          <div class="col-md-3">
            <label class="form-label" for="batch-city">City</label>
            <input
              id="batch-city"
              v-model="baseCheck.accountHolderCity"
              type="text"
              class="form-control"
            >
          </div>
          <div class="col-md-3">
            <label class="form-label" for="batch-state">State</label>
            <input
              id="batch-state"
              v-model="baseCheck.accountHolderState"
              type="text"
              class="form-control"
            >
          </div>
          <div class="col-md-3">
            <label class="form-label" for="batch-zip">Zip</label>
            <input
              id="batch-zip"
              v-model="baseCheck.accountHolderZip"
              type="text"
              class="form-control"
            >
          </div>
          <div class="col-md-6">
            <label class="form-label" for="batch-bank-name">Bank name</label>
            <input
              id="batch-bank-name"
              v-model="baseCheck.bankName"
              type="text"
              class="form-control"
            >
          </div>
          <div class="col-md-3">
            <label class="form-label" for="batch-routing">Routing #</label>
            <input
              id="batch-routing"
              v-model="baseCheck.routingNumber"
              type="text"
              class="form-control"
            >
          </div>
          <div class="col-md-3">
            <label class="form-label" for="batch-account-number">Account #</label>
            <input
              id="batch-account-number"
              v-model="baseCheck.bankAccountNumber"
              type="text"
              class="form-control"
            >
          </div>
          <div class="col-md-6">
            <label class="form-label" for="batch-signature-text">Signature text</label>
            <input
              id="batch-signature-text"
              v-model="baseCheck.signature"
              type="text"
              class="form-control"
            >
          </div>
          <div class="col-md-6">
            <label class="form-label" for="batch-signature-svg">Signature SVG (data URL)</label>
            <input
              id="batch-signature-svg"
              v-model="baseCheck.signatureSvg"
              type="text"
              class="form-control"
            >
          </div>
        </div>
        <div class="button-row">
          <button type="button" class="btn btn-primary" @click="printBatch">
            Print {{ generatedChecks.length }} checks
          </button>
          <button type="button" class="btn btn-outline-secondary" @click="goBack">
            Back to single check
          </button>
        </div>
      </div>
    </div>
    <div class="batch-print-area">
      <CheckPreview
        v-for="(checkItem, index) in generatedChecks"
        :key="`${checkItem.checkNumber}-${index}`"
        :check="checkItem"
        :format-money="formatMoney"
        :to-words="toWords"
      />
    </div>
  </main>
</template>

<style scoped>
.batch-wrapper {
  padding: 20px 0 40px;
}

.batch-controls {
  margin-bottom: 30px;
}

.button-row {
  display: flex;
  gap: 16px;
  margin-top: 20px;
}

.batch-print-area {
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: center;
}

@media print {
  :global(body) {
    margin: 0;
    padding: 0;
  }
  .batch-print-area {
    gap: 0;
  }
  .check-box {
    page-break-after: always;
    break-after: page;
  }
  .check-box:last-of-type {
    page-break-after: auto;
  }
}
</style>
