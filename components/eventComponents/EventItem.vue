<script setup lang="ts">
import { ref, nextTick, getCurrentInstance, inject } from 'vue'
import type { SearchParams, SearchResult, Event } from '@/types/event'
import EventDetails from '@/components/eventComponents/EventDetails.vue'

const props = defineProps(['eventItemData']);
const lockPage = inject('lockPage');
const unlockPage = inject('unlockPage');
const vm = getCurrentInstance();
const detailsRef = ref();
const detailsHeight = ref(null);
let rect = null;
const style = ref({
	position: '',
	zIndex: '',
	width: '',
	height: '',
	top: '',
	left: '',
});

const expanded = ref<boolean>(false);
const showPlaceholder = ref(false);

const animationData = ref({});
const animation = uni.createAnimation({
	duration: 300,
	timingFunction: 'ease-in-out',
});

const eventId = ref('');
function handleEventItem (eventItemData: Event) {
	if (!expanded.value) {
		lockPage();
		uni.createSelectorQuery().in(vm.proxy)
			.select('.event-card')
			.boundingClientRect((data) => {
				rect = data;

				showPlaceholder.value = true;

				if (!detailsHeight.value) {
					detailsHeight.value = `${rect.height}px`;
				}

				setTimeout(() => {
					expanded.value = true;
				}, 300);

				style.value.position = 'fixed';
				style.value.zIndex = '999';
				style.value.width = `${rect.width}px`;
				style.value.height = `${rect.height}px`;
				style.value.top = `${rect.top + uni.getWindowInfo().windowTop}px`;
				style.value.left = `${rect.left}px`;

				// 曲线救国，应该是要等浏览器重绘后再开始动画
				setTimeout(() => {
					animationData.value = animation
						.width('100vw')
						.height('100vh')
						.top(0)
						.left(0)
						.step()
						.export();
				}, 150);
			})
			.exec();
		eventId.value = eventItemData.id;
	}
}

function collapse() {
	const el = detailsRef.value.$el;

	animationData.value = animation.width(rect.width)
		.height(rect.height)
		.top(rect.top)
		.left(rect.left)
		.step()
		.export();

	setTimeout(() => {
		expanded.value = false;
	}, 200);

	setTimeout(() => {
		style.value.position = '';
		style.value.zIndex = '';
		style.value.top = '';
		style.value.left = '';
		showPlaceholder.value = false;
		unlockPage();
	}, 300);
}
</script>


<template>
	<view v-if="showPlaceholder" :style="{ height: detailsHeight }"></view>
	<view ref="detailsRef" class="event-card" :class="{ expanded }" :animation="animationData" :style="{
		position: style.position,
		zIndex: style.zIndex,
		width: style.width,
		height: style.height,
		top: style.top,
		left: style.left,
	}" @click="handleEventItem(eventItemData)" @touchmove.stop="() => { }">
		<view class="waterfall-item__image">
			<image :src="eventItemData.images[0].url" mode="widthFix" style="width: 100%"></image>
			<view v-if="expanded" class="close-button" @click.stop="collapse">
				<uv-icon name="close-circle-fill" color="#ffffff4d" size="56rpx" />
			</view>
		</view>
		<view class="basic-info">
			<text class="title">{{ eventItemData.name }}</text>
			<view class="flex">
				<text class="date-time">{{ `${eventItemData.dates.start.localDate} ${eventItemData.dates.start.localTime.slice(0, -3)}`}}</text>
				<text v-if="expanded" class="classification">
					{{ `${eventItemData.classifications[0].segment.name}·${eventItemData.classifications[0].genre.name}` }}
				</text>
			</view>
		</view>
		<event-details v-if="expanded" :event-id="eventItemData.id" />
	</view>
</template>

<style scoped lang="scss">
.flex {
	margin-top: 8rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.event-card {
	position: relative;
	// transition: all .3s ease-in-out;
	background: #fff;
	overflow: auto;
	overscroll-behavior: contain;

	&.expanded {
		.title {
			font-size: 40rpx !important;
		}
	}

	.basic-info {
		padding: 20rpx;
		background: #fff;

		.title {
			margin-bottom: 10rpx;
			line-height: 48rpx;
			font-weight: 700;
			font-size: 32rpx;
			color: #303133;
			transition: all .3s ease-in-out;
		}

		.date-time,
		.classification {
			font-size: 28rpx;
			color: #999;
		}
	}

	.close-button {
		position: fixed;
		top: 32rpx;
		right: 32rpx;
	}
}
</style>