<template>
		<n-layout  class="export-main" has-sider >
			<n-layout-sider content-style="padding: 24px;" :width="400">
				<n-form
						ref="formRef"
						:model="formModel"
						label-placement="left"
						label-width="auto"
						require-mark-placement="right-hanging"
						:size="'medium'"
						:style="{
							maxWidth: '400px'
						}"
						>
						<n-form-item label="类型" path="inputValue">
							<n-input v-model:value="formModel.data_type" placeholder="桩号、桥、标志牌" />
						</n-form-item>
						<n-form-item label="时间" path="radioGroupValue">
							<n-date-picker 
								v-model:formatted-value="formModel.range"
								type="daterange" 
								clearable
								update-value-on-close
								:actions="null"
								value-format="yyyy-MM-dd"
								/>
						</n-form-item>
					</n-form>
				<div style="text-align: center;margin-top: 30px;">
					<n-button type="info" @click="onQuery" style="width: 100%">
					查询
				</n-button>
				</div>
			</n-layout-sider>
			<n-layout-content content-style="padding: 24px;">
				<n-input
				style="height: 100%"
				v-model:value="jsonData.text"
				type="textarea"
				placeholder="json数据"
				/>
			</n-layout-content>
		</n-layout>
	
</template>

<script setup>
// 查询桩号筛选条件
const formModel = ref({
	data_type: '',
	range: ref(null)
})

const jsonData = ref({
	text: ''
})

const onQuery = async () => {
	let formData = {
		data_type: formModel.value.data_type?formModel.value.data_type:'',
		start_date: formModel.value.range?formModel.value.range[0]:'',
		end_date: formModel.value.range?formModel.value.range[1]:'',
	}
	let data = await proxy.post(window.apiUrl + '/query_field_data', formData)
	jsonData.value.text = data
}


</script>

<style >
.export-main {
	height: 100%;
}
</style>

