<script setup lang="ts">
import { ref, watch } from 'vue'
import { ticketApi } from '@/api'
import { STATUS_CODE } from '@/const/event'


const props = defineProps(['eventId']);
// 活动详情数据
const eventData = ref();
// 是否展示底部按钮
const showBottonBtn = ref(true);

watch(() => props.eventId, (value) => {
	if (value) {
		queryEventDetails();
	}
}, {
	immediate: true,
});

// 查询详情数据
async function queryEventDetails() {
	showBottonBtn.value = true;
	const res = await ticketApi.getEventDetails(props.eventId);
	eventData.value = res;
}
// 点击购票按钮
function openTicketUrl() {
	uni.showToast('暂未开发')
}

// 格式化时间的函数
function formatDateTime(dateTimeStr: string) {
  if (!dateTimeStr) return '';
  const date = new Date(dateTimeStr);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
</script>

<template>
	<view v-if="eventData">
		<view class="waterfall-item__image">
			<view class='status-tag'>{{ STATUS_CODE[eventData.dates.status.code] }}</view>
		</view>
		<!-- 基础信息 -->
		<view class="base-info">
			<view class="info-item">
				<view class="info-label">Venue</view>
				<view class="venue-info">
					<view class="venue-name"> {{ eventData._embedded.venues[0].name }}</view>
					<view class="venue-address">
						{{ `${eventData._embedded.venues[0].address.line1}, ${eventData._embedded.venues[0].city.name},
						${eventData._embedded.venues[0].state.stateCode} ${eventData._embedded.venues[0].postalCode},
						${eventData._embedded.venues[0].country.name}` }}
					</view>
				</view>
			</view>

			<view class="info-item">
				<view class="info-label">More Info</view>
				<div class="more-content">
					<div class="more-item">
						<span class="more-label">Sale End Time:</span>
						<span class="more-value">{{ formatDateTime(eventData.sales.public.endDateTime) }}</span>
					</div>
					<div class="more-item">
						<span class="more-label">Venue Timezone:</span>
						<span class="more-value">{{ eventData._embedded.venues[0].timezone }}</span>
					</div>
				</div>
			</view>

			<view v-if="eventData?.seatmap?.staticUrl" class="info-item">
				<view class="info-label">Seating Chart</view>
				<image :src="eventData.seatmap.staticUrl" mode="widthFix" style="width: 100%"></image>
			</view>

		</view>


		<!-- 底部固定按钮 -->
		<!-- <view v-if="showBottonBtn" class="bottom-btn-area">
						<view class="seat-btn">
				<uv-icon name="empty-address" color="#7d7e80" size="38rpx" label="座位图" labelPos="bootom"
					labelSize="16rpx" labelColor="7d7e80" space="8rpx"></uv-icon>
			</view>
			<button class="bottom-buy-btn" @click="openTicketUrl">立即购票</button>
		</view> -->
	</view>
</template>


<style lang="scss" scoped>
.close-icon {
	position: fixed;
	top: 30rpx;
	right: 30rpx;
	z-index: 999;
}

.status-tag {
	position: absolute;
	top: 30rpx;
	left: 30rpx;
	z-index: 999;
	background-color: #3c9cff;
	color: white;
	padding: 10rpx 20rpx;
	border-radius: 8rpx;
	font-size: 24rpx;
	font-weight: 500;

}

/* 基础信息区域 */
.base-info {
	background-color: white;
	padding: 0 20rpx;
	margin-bottom: 100rpx;


	.info-item {
		margin-bottom: 30rpx;
	}

	.info-label {
		font-size: 28rpx;
		color: #999;
		margin-bottom: 10rpx;
		display: block;
	}

	.info-value {
		font-size: 32rpx;
		color: #333;
		font-weight: 500;
	}

	.venue-name {
		font-size: 32rpx;
		color: #333;
		font-weight: 500;
		margin-bottom: 10rpx;
		display: block;
	}

	.venue-address {
		font-size: 28rpx;
		color: #666;
		line-height: 1.4;
	}

	.more-content {
		margin-top: 30rpx;
	}

	.more-content.show {
		display: block;
	}

	.more-item {
		display: flex;
		margin-bottom: 20rpx;
		font-size: 28rpx;
	}

	.more-label {
		color: #999;
		flex: 1;
	}

	.more-value {
		color: #333;
		flex: 2;
	}
}

/* 底部固定按钮 */
.bottom-btn-area {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: white;
	padding: 30rpx 40rpx;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 30rpx;

	.bottom-buy-btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #3c9cff;
		color: white;
		border: none;
		border-radius: 50rpx;
		height: 100rpx;
		font-size: 32rpx;
		font-weight: 500;
		margin-right: 60rpx;
	}
}
</style>