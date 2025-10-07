<template>
    <div class="wrapper" id="wrapper" style="position: relative;">
        <CheckPreview
            :check="check"
            :format-money="formatMoney"
            :to-words="toWords"
        />
        <div class="check-data" style="position: absolute; top: 450px">
            <div class="alert alert-primary" role="alert"><strong>Background does not print.</strong></div>
            <div class="action-buttons">
                <button type="button" class="btn btn-secondary" @click="openBatchPrint">Print 12-week series</button>
                <button type="button" class="btn btn-primary" @click="printCheck">Print (Ctrl + P)</button>
            </div>
            <form class="row g-3">
                <div class="col-md-6">
                    <label for="inputEmail4" class="form-label">Account Holder Name</label>
                    <input type="email" class="form-control" id="inputEmail4" v-model="check.accountHolderName">
                </div>
                <div class="col-md-6">
                    <label for="companyLogo" class="form-label">Company Logo</label>
                    <input
                        id="companyLogo"
                        ref="companyLogoInput"
                        type="file"
                        accept="image/*"
                        class="form-control"
                        @change="handleCompanyLogoUpload"
                    >
                    <div class="form-text">Upload logo image (PNG, JPG, SVG, etc.).</div>
                    <button
                        v-if="check.companyLogo"
                        type="button"
                        class="btn btn-outline-secondary btn-sm"
                        style="margin-top: 10px;"
                        @click="clearCompanyLogo"
                    >
                        Remove logo
                    </button>
                </div>
                <div class="col-md-4">
                    <label for="inputAddress" class="form-label">Address</label>
                    <input type="text" class="form-control" id="inputAddress" v-model="check.accountHolderAddress">
                </div>
                <div class="col-md-2">
                    <label for="inputCity" class="form-label">City</label>
                    <input type="text" class="form-control" v-model="check.accountHolderCity">
                </div>
                <div class="col-md-2">
                    <label for="inputState" class="form-label">State</label>
                    <input type="text" class="form-control" v-model="check.accountHolderState">
                </div>
                <div class="col-md-2">
                    <label for="inputZip" class="form-label">Zip</label>
                    <input type="text" class="form-control" v-model="check.accountHolderZip">
                </div>
            </form>
            <form class="row g-3" style="margin-top: 30px; border-top: 1px solid #e7e7e7;">
                <div class="col-md-2">
                    <label for="inputEmail4" class="form-label">Check Number</label>
                    <input type="email" class="form-control" id="inputEmail4" v-model="check.checkNumber">
                </div>
                <div class="col-md-4">
                    <label for="inputAddress" class="form-label">Bank Name</label>
                    <input type="text" class="form-control" id="inputAddress" v-model="check.bankName">
                </div>
                <div class="col-md-2">
                    <label for="inputCity" class="form-label">Routing #</label>
                    <input type="text" class="form-control" v-model="check.routingNumber">
                </div>
                <div class="col-md-2">
                    <label for="inputState" class="form-label">Account #</label>
                    <input type="text" class="form-control" v-model="check.bankAccountNumber">
                </div>
                <div class="col-md-6">
                    <label for="inputZip" class="form-label">Memo</label>
                    <input type="text" class="form-control" v-model="check.memo">
                </div>
            </form>
            <form class="row g-3" style="margin-top: 30px; border-top: 1px solid #e7e7e7;">
                <div class="col-md-2">
                    <label for="inputEmail4" class="form-label">Amount</label>
                    <input type="email" class="form-control" id="inputEmail4" v-model="check.amount">
                </div>
                <div class="col-md-6">
                    <label for="inputZip" class="form-label">Pay To</label>
                    <input type="text" class="form-control" v-model="check.payTo">
                </div>
                <div class="col-md-2">
                    <label for="inputEmail4" class="form-label">Date</label>
                    <input type="email" class="form-control" id="inputEmail4" v-model="check.date">
                </div>
                <div class="col-md-6">
                    <label for="signatureText" class="form-label">Signature Text</label>
                    <input id="signatureText" type="text" class="form-control" v-model="check.signature">
                </div>
                <div class="col-md-6">
                    <label for="signatureSvg" class="form-label">Signature SVG</label>
                    <input
                        id="signatureSvg"
                        ref="signatureSvgInput"
                        type="file"
                        accept="image/svg+xml"
                        class="form-control"
                        @change="handleSignatureSvgUpload"
                    >
                    <div class="form-text">Upload an SVG signature image.</div>
                    <button
                        v-if="check.signatureSvg"
                        type="button"
                        class="btn btn-outline-secondary btn-sm"
                        style="margin-top: 10px;"
                        @click="clearSignatureSvg"
                    >
                        Remove signature image
                    </button>
                </div>
            </form>
            <div class="col-12" style="margin-top: 30px;">
                <button type="button" class="btn btn-primary" @click="saveToHistory">Save to History</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ToWords } from 'to-words';
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import CheckPreview from './CheckPreview.vue'
import { appendToHistory, cloneCheck, createDefaultCheck, formatMoney } from '../utilities'
import { useAppStore } from '../stores/app'
import type { CheckData } from '../types/check'

const state = useAppStore()
const router = useRouter()
const check = reactive<CheckData>(createDefaultCheck())
const signatureSvgInput = ref<HTMLInputElement | null>(null)
const companyLogoInput = ref<HTMLInputElement | null>(null)

const toWordsTool = new ToWords({
  localeCode: 'en-US',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: true,
  },
});

const toWords: (denom: number | string) => string = (denom) => {
    try {
        return toWordsTool.convert(Number(denom));
    } catch (e) {
        return `${e}`;
    }
}

function printCheck () {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        @page {
          margin: 0;
        }
        body {
          transform: scale(1);
          transform-origin: top center;
          width: 149%;
          margin: 0;
          padding: 0;
        }
        .wrapper > *:not(.check-box) {
          display: none !important;
        }
        .check-data {
            display: none;
        }
        .check-box {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0px;
          background-color: white;
          background: white !important;
          border: none !important;
          box-shadow: none !important;
        }
        .check-box-print {
          position: relative;
        }
      }
    `;
    document.head.appendChild(style);
    window.print();
    style.remove();
}

function handlePrintShortcut(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'p') {
        event.preventDefault();
        printCheck();
    }
}

function handleSignatureSvgUpload(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) {
        check.signatureSvg = null
        return
    }

    if (file.type !== 'image/svg+xml') {
        target.value = ''
        return
    }

    const reader = new FileReader()
    reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : null
        if (result) {
            check.signatureSvg = result
        }
        target.value = ''
    }
    reader.readAsDataURL(file)
}

function saveToHistory () {
    appendToHistory(check)
}

function clearSignatureSvg() {
    check.signatureSvg = null
    if (signatureSvgInput.value) {
        signatureSvgInput.value.value = ''
    }
}

function handleCompanyLogoUpload(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) {
        check.companyLogo = null
        return
    }

    if (!file.type.startsWith('image/')) {
        target.value = ''
        return
    }

    const reader = new FileReader()
    reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : null
        if (result) {
            check.companyLogo = result
        }
        target.value = ''
    }
    reader.readAsDataURL(file)
}

function clearCompanyLogo() {
    check.companyLogo = null
    if (companyLogoInput.value) {
        companyLogoInput.value.value = ''
    }
}

function openBatchPrint() {
    state.batchTemplate = cloneCheck(check)
    router.push('/batch-print')
}

onMounted(() => {
    if (state.check) {
        Object.assign(check, state.check)
    }
    state.check = null

    window.addEventListener('keydown', handlePrintShortcut);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handlePrintShortcut);
});

</script>

<style>
label {
    font-weight: bold;
}
.check-data {
    margin-top: 50px;
    padding: 50px 120px;
    border-top: 1px solid #e6e6e6;
}
.action-buttons {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-bottom: 20px;
}
</style>
