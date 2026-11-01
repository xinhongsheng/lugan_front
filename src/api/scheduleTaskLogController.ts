// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 POST /scheduleTaskLog/list/page/vo */
export async function listScheduleTaskLogVoByPage(
  body: API.ScheduleTaskLogQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageResultScheduleTaskLogVO>('/scheduleTaskLog/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
