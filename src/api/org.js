/**
 * “机构管理”相关接口
 */
import request from '@/utils/request'

export default {
  /**
   * 添加机构
   */
  addOrg(data) {
    return request({
      url: '/sys_org',
      method: 'post',
      data
    })
  },
  /**
   * 修改机构
   * @param data
   */
  updateOrg(data) {
    return request({
      url: '/sys_org',
      method: 'patch',
      data
    })
  },
  deleteOrg(data) {
    return request({
      url: '/sys_org',
      method: 'delete',
      data
    })
  },
  queryOrg(data) {
    return request({
      url: '/sys_org/query',
      method: 'post',
      data
    })
  }
}
