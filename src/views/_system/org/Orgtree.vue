<template>
    <div class="app-container">

      <el-row :gutter="20">

        <!--组织机构树-->
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header">
              <div class="title-box">
                <span><el-tag type="success" >组织机构树</el-tag></span>
              </div>
            </div>
            <el-input class="mgb-15" :placeholder="filterPlaceholderText" v-model="orgQuery.oname"></el-input>
            <el-tree ref="orgTreeRef"
                     :data="orgData"
                     :props="treeProps"
                     node-key="oid"
                     default-expand-all
                     :expand-on-click-node="false">
            </el-tree>
          </el-card>
        </el-col>
      </el-row>

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
  import orgApi from '@/api/org'
  import { parseTime, resetTemp } from '@/utils'
  import { root, confirm, pageParamNames } from '@/utils/constants'
  import debounce from 'lodash/debounce'

  export default {
    name: 'Orgtree',
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

        filterPlaceholderText: '输入权限名称、权限值过滤',
        dialogFormVisible: null,

        orgData: {},
        treeProps: {
          label: 'oname',
          children: 'children'
        },
        orgQuery: {
          oname: ''
        },
        dialogStatus: '',
        temp: {
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
      // this.fetchData()
      this.getTop()
    },

    watch: {
      // 延时查询
      'orgQuery.oname': debounce(function() {
        this.fetchData()
      }, 500)
    }, // watch

    methods: {
      getTop() {
        this.tableLoading = true
        orgApi.getTop().then(res => {
          this.orgData = res.data.tree.node
          this.tableLoading = false
        })
      },
      // 查询
      fetchData() {
        this.tableLoading = true
        orgApi.queryOrg(this.orgQuery).then(res => {
          this.orgData = res.data.list
          this.tableLoading = false
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

<style scoped>

</style>
