<template>
    <div v-if="previewType">
        <vue-office-docx :src="previewUrl" v-if="previewType== '.docx'" />
        <vue-office-excel :src="previewUrl" v-else-if="previewType== '.xlsx'" />
        <vue-office-pdf :src="previewUrl" v-else />
    </div>
</template>

<script>

import VueOfficeDocx from '@vue-office/docx'
import VueOfficeExcel from '@vue-office/excel'
import VueOfficePdf from '@vue-office/pdf'
//引入相关样式
import '@vue-office/docx/lib/index.css'
import '@vue-office/excel/lib/index.css'

export default {
    components: {
        VueOfficeDocx,
        VueOfficeExcel,
        VueOfficePdf
    },
    props: {
        previewUrl: {
            type: String,
            default: ''
        },
        previewType: {
            type: String,
            default: ''
        }
    },
}
</script>

<style>
</style>
