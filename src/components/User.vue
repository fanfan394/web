<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加 -->
    <el-dialog title="添加" :visible.sync="addDialogVisible" width="50%" @close="resetForm()">
      <el-form :rules="addFormRules" ref="addFormRef" :model="addForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog title="修改" :visible.sync="editDialogVisible" width="50%" @close="reseteditForm()">
      <el-form :rules="editFormRules" ref="editFormRef" :model="editForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="querycdt.query"
            clearable
            @clear="search()"
            @keyup.enter.native="search()"
          >
            <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" style="width: 100%" :stripe="true" :border="true">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名" width="160"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="130"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="160"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="60">
          <el-switch v-model="info.row.mg_state" slot-scope="info"></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="info">
            <el-tooltip content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(info.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(info.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenu"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.listData()
  },
  data() {
    var checkMoble = (rule, value, callback) => {
      var reg = /^1[3456789]\d{9}$/
      if (!reg.test(value)) {
        return callback(new Error('手机号格式错误'))
      }
      callback()
    }
    return {
      tableData: [],
      tot: 0,
      querycdt: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      addDialogVisible: false,
      editDialogVisible: false,
      addFormRules: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请填写密码', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请填写手机号', trigger: 'blur' },
          { validator: checkMoble, trigger: 'blur' }
        ]
      },
      editFormRules: {
        password: [{ required: true, message: '请填写密码', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请填写手机号', trigger: 'blur' },
          { validator: checkMoble, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    search() {
      this.listData()
    },
    async listData() {
      const { data: dt } = await this.$http.get('users', {
        params: this.querycdt
      })
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.tot = dt.data.total
      this.tableData = dt.data.users
    },
    handleSizeChange(arg) {
      // console.log(arg)
      this.querycdt.pagesize = arg
      this.listData()
    },
    handleCurrentChange(arg) {
      // console.log(arg)
      this.querycdt.pagenum = arg
      this.listData()
    },
    resetForm() {
      this.$refs.addFormRef.resetFields()
    },
    reseteditForm() {
      this.$refs.editFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const { data: dt } = await this.$http.post('users', this.addForm)
          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.listData()
          this.addDialogVisible = false
        }
      })
    },
    del(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const { data: dt } = await this.$http.delete('users/' + id)
          // console.log(dt)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          if (this.tableData.length === 1 && this.querycdt.pagenum > 1) {
            this.querycdt.pagenum--
          }
          this.listData()
        })
        .catch(() => {})
    },
    async edit(id) {
      console.log(id)
      const { data: dt } = await this.$http.get('users/' + id)
      this.editForm = dt.data
      // console.log(dt)
      this.editDialogVisible = true
    },
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          const { data: dt } = await this.$http.put(
            'users/' + this.editForm.id,
            this.editForm
          )
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.listData()
          this.editDialogVisible = false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
