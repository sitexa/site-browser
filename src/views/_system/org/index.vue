<template>
  <div class="app-container">
    <!--查询  -->
    <el-row>
      <el-input style="width:200px;" v-model="tableQuery.oname" placeholder="名称"></el-input>
      <span style="margin-right: 15px;"></span>
      <el-tooltip class="item" content="搜索" placement="top" >
        <el-button icon="el-icon-search" circle @click="fetchData(1)" v-perm="'b:user:query'"></el-button>
      </el-tooltip>
    </el-row>
    <div style="margin-bottom: 30px;"></div>
    <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleCreate" v-perm="'b:user:add'">{{textMap.create}}</el-button>
    <div style="margin-bottom: 30px;"></div>
    <!--列表-->
    <el-table style="width: 100%"
              :data="tableData"
              v-loading.body="tableLoading"
              element-loading-text="加载中"
              border fit highlight-current-row>
      <el-table-column prop="oid" label="机构id"></el-table-column>
      <el-table-column prop="oname" label="机构名称"></el-table-column>
      <el-table-column prop="oaddr" label="地址"></el-table-column>
      <el-table-column prop="olevel" label="机构级别"></el-table-column>
      <el-table-column prop="otype" label="机构类型"></el-table-column>
      <el-table-column prop="created" label="创建时间">
        <template slot-scope="scope">
          <span v-text="parseTime(scope.row.created,'{y}-{m}-{d}')"></span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button @click="handleUpdate(scope.$index,scope.row)" size="mini" type="info" icon="el-icon-edit" circle plain></el-button>
          </el-tooltip>
          <el-tooltip content="禁用" placement="top" v-if="!hasAdminRole(scope.row)">
            <el-button @click="handleUpdateUserRoles(scope.$index,scope.row)" size="mini" type="warning" icon="el-icon-star-off" circle plain></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top" v-if="!hasAdminRole(scope.row)">
            <el-button @click="handleDelete(scope.$index,scope.row)" size="mini" type="danger" icon="el-icon-delete" circle plain></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-bottom: 30px;"></div>
    <!--分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="tablePage.current"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="tablePage.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tablePage.total">
    </el-pagination>
    <!--弹出窗口：新增/编辑组织机构-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="100px">

        <el-form-item label="机构名称" prop="oname" v-if="dialogStatus==='create'">
          <el-input v-model="temp.oname"></el-input>
        </el-form-item>

        <el-form-item label="地址" prop="oaddr">
          <el-input v-model="temp.oaddr"></el-input>
        </el-form-item>

        <el-form-item label="级别" prop="olevel">
          <el-input v-model="temp.olevel"></el-input>
        </el-form-item>

        <el-form-item label="类型" prop="otype">
          <el-input v-model="temp.otype"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="createData">创建</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  // import optionApi from '@/api/option'
  import orgApi from '@/api/org'
  import { parseTime, resetTemp } from '@/utils'
  import { root, confirm, pageParamNames } from '@/utils/constants'
  import debounce from 'lodash/debounce'

  export default {

    name: 'OrgManage',

    data() {
      const validateName = (rule, value, callback) => {
        if (this.dialogStatus === 'create' && value === '') {
          callback(new Error('必填'))
        } else {
          callback()
        }
      }

      const validateType = (rule, value, callback) => {
        if (this.dialogStatus === 'create' && value === '') {
          callback(new Error('必填'))
        } else {
          callback()
        }
      }

      return {
        parseTime: parseTime,
        tableLoading: false,
        tableData: [],
        tableQuery: {
          oname: ''
        },
        tablePage: {
          current: null,
          pages: null,
          size: null,
          total: null
        },
        dialogFormVisible: false,
        editRolesDialogVisible: false,
        dialogStatus: '',
        temp: {
          idx: null, // tableData中的下标
          oid: null,
          oname: null,
          oaddr: null,
          otype: null,
          created: null,
          updated: null
        },
        textMap: {
          update: '编辑机构',
          create: '新增机构'
        },
        rules: {
          oname: [{ validator: validateName, trigger: 'blur' }],
          otype: [{ validator: validateType, trigger: 'blur' }]
        }
      }
    },

    created() {
      this.fetchData()
    },

    watch: {
      // 延时查询
      'tableQuery.oname': debounce(function() {
        this.fetchData()
      }, 500)
    }, // watch

    methods: {

      hasAdminRole(row) {
        if (row && row.roleList) {
          return row.roleList.some(role => role.rval === root.rval)
        }
        return false
      },

      // 全选
      handleCheckAllChange(val) {
        const allRids = this.roleOptions.map(role => role.id)
        this.updateUserRolesData.rids = val ? allRids : []
        this.isIndeterminate = false
      },

      // 分页
      handleSizeChange(val) {
        this.tablePage.size = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.tablePage.current = val
        this.fetchData()
      },

      // 查询
      fetchData() {
        this.tableLoading = true
        orgApi.queryOrg(this.tableQuery, this.tablePage).then(res => {
          this.tableData = res.data.page.records
          this.tableLoading = false
          pageParamNames.forEach(name => this.$set(this.tablePage, name, res.data.page[name]))
        })
      },

      // 更新
      handleUpdate(idx, row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.idx = idx
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => this.$refs['dataForm'].clearValidate())
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (!valid) return
          const tempData = Object.assign({}, this.temp)// copy obj
          orgApi.updateOrg(tempData).then(res => {
            tempData.updated = res.data.updated
            this.tableData.splice(tempData.idx, 1, tempData)
            this.dialogFormVisible = false
            this.$message.success('更新成功')
          })
        })
      },

      // 删除
      handleDelete(idx, row) {
        this.$confirm('您确定要永久删除该用户？', '提示', confirm).then(() => {
          orgApi.deleteOrg({ oid: row.oid }).then(res => {
            this.tableData.splice(idx, 1)
            --this.tablePage.total
            this.dialogFormVisible = false
            this.$message.success('删除成功')
          })
        }).catch(() => {
          this.$message.info('已取消删除')
        })
      },

      // 新增
      handleCreate() {
        resetTemp(this.temp)
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (!valid) return
          orgApi.addOrg(this.temp).then((res) => {
            this.temp.oid = res.data.oid// 后台传回来新增记录的id
            this.temp.created = res.data.created// 后台传回来新增记录的时间
            this.tableData.unshift(Object.assign({}, this.temp))
            ++this.tablePage.total
            this.dialogFormVisible = false
            this.$message.success('添加成功')
          })
        })
      }

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .role-checkbox{
    margin-left: 0px;
    margin-right: 15px;
  }
</style>
