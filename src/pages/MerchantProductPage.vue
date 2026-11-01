<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { getHomeVo } from '@/api/homeController'
import { addProduct, listMyProduct, shelfProduct, submitProduct, uploadProductCover } from '@/api/productController'
import MerchantGate from '@/components/MerchantGate.vue'
import MerchantNav from '@/components/MerchantNav.vue'

const rows = ref<API.Product[]>([])
const categories = ref<API.CategoryVO[]>([])
const form = reactive<API.ProductAddRequest>({
  categoryId: undefined,
  name: '',
  origin: '永春达埔',
  spec: '5斤装',
  price: 39.9,
  stock: 10,
  priceMode: 'pack',
  imageUrls: [],
})

function flatten(list: API.CategoryVO[] | undefined, acc: API.CategoryVO[]) {
  for (const item of list || []) {
    acc.push(item)
    flatten(item.children, acc)
  }
  return acc
}

async function load() {
  const home = await getHomeVo()
  if (home.data.code === 0) {
    categories.value = flatten(home.data.data?.categoryList, [])
  }
  const response = await listMyProduct({ current: 1, pageSize: 10 })
  if (response.data.code !== 0) {
    message.error(response.data.message || '商品加载失败')
    return
  }
  rows.value = response.data.data?.list ?? []
}

async function onFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) {
    return
  }
  const response = await uploadProductCover(file)
  if (response.data.code !== 0 || !response.data.data) {
    message.error(response.data.message || '图片上传失败')
    return
  }
  form.imageUrls = [response.data.data]
  message.success('实拍图已上传')
}

async function createProduct() {
  if (!form.categoryId) {
    message.warning('请选择分类')
    return
  }
  if (!form.imageUrls?.length) {
    message.warning('请上传实拍图')
    return
  }
  const response = await addProduct(form)
  if (response.data.code !== 0) {
    message.error(response.data.message || '新建失败')
    return
  }
  message.success('已保存草稿')
  await load()
}

async function submit(id?: string) {
  const response = await submitProduct({ id })
  if (response.data.code !== 0) {
    message.error(response.data.message || '提交失败')
    return
  }
  message.success('已提交审核')
  await load()
}

async function shelf(id?: string, shelfStatus?: number) {
  const response = await shelfProduct({ id, shelfStatus })
  if (response.data.code !== 0) {
    message.error(response.data.message || '上下架失败')
    return
  }
  await load()
}

onMounted(load)
</script>

<template>
  <div id="merchant-product-page">
    <MerchantGate>
      <MerchantNav />
      <a-card title="发布芦柑">
        <a-form layout="inline">
          <a-form-item label="分类">
            <a-select v-model:value="form.categoryId" style="width: 180px" placeholder="选择分类">
              <a-select-option v-for="item in categories" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="品名"><a-input v-model:value="form.name" /></a-form-item>
          <a-form-item label="售价"><a-input-number v-model:value="form.price" :min="0" /></a-form-item>
          <a-form-item label="库存"><a-input-number v-model:value="form.stock" :min="0" /></a-form-item>
          <a-form-item label="实拍图"><input type="file" accept="image/*" @change="onFile" /></a-form-item>
          <a-button type="primary" @click="createProduct">保存草稿</a-button>
        </a-form>
      </a-card>
      <a-card title="我的商品" style="margin-top: 16px">
        <a-table :data-source="rows" :pagination="false" row-key="id">
          <a-table-column title="品名" data-index="name" />
          <a-table-column title="审核" data-index="auditStatus" />
          <a-table-column title="上架" data-index="shelfStatus" />
          <a-table-column title="操作">
            <template #default="{ record }">
              <a-button type="link" @click="submit(record.id)">提交审核</a-button>
              <a-button type="link" @click="shelf(record.id, record.shelfStatus === 1 ? 0 : 1)">
                {{ record.shelfStatus === 1 ? '下架' : '上架' }}
              </a-button>
            </template>
          </a-table-column>
        </a-table>
      </a-card>
    </MerchantGate>
  </div>
</template>

<style scoped>
#merchant-product-page {
  max-width: 1080px;
  margin: 24px auto;
}
</style>
