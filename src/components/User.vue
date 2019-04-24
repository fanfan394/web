<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
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
          <el-button type="primary">添加用户</el-button>
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
          <el-tooltip content="修改" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </el-tooltip>
          <el-tooltip content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
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
    return {
      tableData: [],
      tot: 0,
      querycdt: {
        query: '',
        pagenum: 1,
        pagesize: 2
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
      console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.tot = dt.data.total
      this.tableData = dt.data.users
    },
    handleSizeChange(arg) {
      console.log(arg)
      this.querycdt.pagesize = arg
      this.listData()
    },
    handleCurrentChange(arg) {
      console.log(arg)
      this.querycdt.pagenum = arg
      this.listData()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
