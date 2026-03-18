<script setup lang="ts">
import { onPullDownRefresh, onReachBottom, onPageScroll } from '@dcloudio/uni-app'
import { ref, onMounted, computed, provide } from 'vue'
import { ticketApi } from '@/api'
import type { SearchParams, SearchResult, Event } from '@/types/event'
import EventItem from '@/components/eventComponents/EventItem.vue'

const waterfallRef = ref();
// 关键字搜索
const keyword = ref<string>('');
// 搜索tag
const isSearchTag = ref<boolean>(false);
// 列表数据
const EventList = ref<Array<Event>>([]);
// 分页
const page = ref<number>(1);
//页面锁定
const {
	pageOverflow,
	enablePullDownRefresh,
} = usePageLock();

// 瀑布流数据
const data = ref({
	// 瀑布流第一列数据
	list1: [],
	// 瀑布流第二列数据
	list2: [],
});

// 加载更多
const loadStatus = ref('loadMore')

// 下拉刷新数据
onPullDownRefresh(async () => {
	await queryEventList(true);
	uni.showToast({
		icon: 'success',
		title: '刷新成功'
	})
	uni.stopPullDownRefresh();
});

// 触底加载更多
onReachBottom(() => {
	if (loadStatus.value == 'loadMore') {
		loadStatus.value = 'loading';
		queryEventList();
		loadStatus.value = 'loadMore';
	}
})


queryEventList()

// 查询列表
async function queryEventList (reload?: boolean) {
	try {
		// 重置数据
		if (reload) {
			page.value = 1;
			waterfallRef.value.clear();
			data.value.list1 = [];
			data.value.list2 = [];
		}

		const res = await ticketApi.getTicketList({
			page: page.value,
			size: 20,
			keyword: keyword.value,
		});

		if (reload) {
			EventList.value = res._embedded.events;
		} else {
			EventList.value.push(...res._embedded.events);
		}

		page.value++;
	} catch (error) {
		console.error('获取列表失败:', error)
	}
}

// e.name在这里返回是list1或list2，要手动将数据追加到相应列
const changeList = (e: { name: string, value: Event }) => {
	data.value[e.name].push(e.value);
};

// 清空搜索框
function handleClear() {
	keyword.value = '';
	// 通过输入框搜索之后清空初始化列表数据
	if (isSearchTag.value) {
		queryEventList(true)
		isSearchTag.value = false;
	}
}

//  搜索
function handleSearch() {
	isSearchTag.value = true;
	queryEventList(true)
}

// 页面锁定
function usePageLock() {
	const pageOverflow = ref('auto');
	const enablePullDownRefresh = ref(true);

	provide('lockPage', lockPage);
	provide('unlockPage', unlockPage);

	function lockPage() {
		pageOverflow.value = 'hidden';
		enablePullDownRefresh.value = false;
	}

	function unlockPage() {
		pageOverflow.value = 'auto';
		enablePullDownRefresh.value = true;
	}

	return {
		pageOverflow,
		enablePullDownRefresh,
	};
}
</script>

<template>
	<page-meta :page-style="`overflow: ${pageOverflow}`" :enable-pull-down-refresh="enablePullDownRefresh"></page-meta>
	<view class="content-box">
		<view class="search-box">
			<uv-search placeholder="请输入搜索内容" v-model="keyword" @search="handleSearch"
				@custom="handleSearch" @clear="handleClear"></uv-search>
		</view>
		<view class="waterfall">
			<uv-waterfall ref="waterfallRef" v-model="EventList" :add-time="10" :left-gap="10" :right-gap="10"
				:column-gap="10" @changeList="changeList">
				<!-- 第一列数据 -->
				<template v-slot:list1>
					<!-- 为了磨平部分平台的BUG，必须套一层view -->
					<view>
						<view v-for="item in data.list1" :key="item.id" class="waterfall-item">
							<event-item :eventItemData="item"></event-item>
						</view>
					</view>
				</template>
				<!-- 第二列数据 -->
				<template v-slot:list2>
					<!-- 为了磨平部分平台的BUG，必须套一层view -->
					<view>
						<view v-for="item in data.list2" :key="item.id" class="waterfall-item">
							<event-item :event-item-data="item"></event-item>
						</view>
					</view>
				</template>
			</uv-waterfall>

			<!-- 加载更多组件 -->
			<uv-load-more v-if="EventList.length" :status="loadStatus"></uv-load-more>
		</view>
	</view>
</template>

<style scoped lang="scss">
.search-box {
	background-color: #ffffff;
	position: sticky;
	z-index: 970;
	top: 0;
	padding: 22rpx 8rpx;
}

.content-box {
	background-color: #eee;
}

.waterfall-item {
	overflow: hidden;
	margin-top: 10px;
}
</style>