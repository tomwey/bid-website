<template>
  <div class="business-bid" v-loading="loading">
    <div class="stat-newbar">
      <el-row>
        <el-col :span="16">
          <span class="stat">共{{totalSize}}条</span>
        </el-col>
        <!-- <el-col :span="8" style="text-align:right;">
          <el-button type="primary" @click="newPriceBid">新增商务回标</el-button>
        </el-col>-->
      </el-row>
    </div>
    <div class="list">
      <el-table key="bidPriceTableParent" :data="tableData" stripe style="width: 100%">
        <el-table-column type="expand">
          <el-table key="bidPriceTable" :data="bidPriceData" stripe style="width: 100%">
            <el-table-column label="回标报价总金额（含税总价，单位元）" prop="money" width="280">
              <template slot-scope="scope">
                <span
                  @click="showMoney(scope.row);"
                >{{scope.row.showmoney ? scope.row.money : "********"}}</span>
              </template>
            </el-table-column>
            <el-table-column label="税率(%)" prop="rate" width="120"></el-table-column>
            <el-table-column label="商务标附件">
              <template slot-scope="scope">
                <a
                  style="color: rgb(231,90,22); text-decoration: underline;cursor:pointer;"
                  :href="scope.row.url"
                  target="_blank"
                >附件</a>
              </template>
            </el-table-column>
            <el-table-column label="其它标书附件">
              <template slot-scope="scope">
                <a
                  style="color: rgb(231,90,22); text-decoration: underline;cursor:pointer;"
                  :href="scope.row.url"
                  target="_blank"
                >附件</a>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="投标时间" width="180"></el-table-column>
          </el-table>
        </el-table-column>
        <el-table-column label="事项名称" prop="title"></el-table-column>
        <el-table-column label="项目" prop="project" width="120"></el-table-column>
        <el-table-column label="楼栋/标段" prop="room" width="120"></el-table-column>
        <el-table-column label="投标截止时间" prop="time" width="120"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="newPriceBid(scope.row)">投标</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-container" v-if="totalSize >= pageSize">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalSize"
          :page-size="pageSize"
          :current-page="page"
          @current-change="pageChange"
        ></el-pagination>
      </div>
    </div>

    <el-dialog
      title="新增商务回标"
      :visible.sync="dialogFormVisible"
      :append-to-body="true"
      center
      v-loading="commiting"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @close="$refs.refForm.$refs.form && $refs.refForm.$refs.form.resetFields()"
    >
      <form-fields
        form-ref="form"
        ref="refForm"
        :controls="bidPriceFormControls"
        :form-model="bidPriceFormModel"
      ></form-fields>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commit">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "business-bid",
  props: {
    noticeid: {
      type: String
    },
    purchasematterid: {
      type: String
    }
  },
  components: {
    formFields: function(resolve) {
      require(["@/components/profile/form-fields"], resolve);
    }
  },
  data() {
    return {
      loading: false,
      commiting: false,
      tableData: [],
      totalSize: 0,
      pageSize: 20,
      page: 1,
      dialogFormVisible: false,
      bidPriceData: [
        {
          money: "2394483",
          rate: "0.03",
          time: "2019-01-01 12:30:03"
        },
        {
          money: "2394483",
          rate: "0.03",
          time: "2019-01-01 12:30:03"
        }
      ],
      bidPriceFormControls: [
        {
          id: "price-money",
          type: 1,
          subtype: "number",
          label: "回标总金额",
          field: "money",
          unit: "元",
          rules: [
            { required: true, message: "回标总金额不能为空", trigger: "blur" }
          ]
        },
        {
          id: "price-rate",
          type: 1,
          subtype: "number",
          label: "税率",
          field: "rate",
          unit: "%",
          rules: [
            // { required: true, message: "注册资本不能为空", trigger: "blur" }
          ]
        },
        {
          id: "price-file",
          type: 8,
          //   subtype: "file",
          label: "商务标附件",
          field: "faqannex",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_Sub_Info",
          fieldname: "faqannex"
        },
        {
          id: "other-file",
          type: 8,
          label: "其它标书附件",
          field: "faqannex1",
          domanid: this.$store.state.supinfo.accountid || "0",
          tablename: "H_Sup_Sub_Info",
          fieldname: "faqannex"
        }
      ],
      bidPriceFormModel: {}
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    pageChange(val) {
      this.page = val;
      this.loadData();
    },
    loadData() {
      this.loading = true;
      this.$post(
        {
          action: "P_SUP_Bid_GetMatterSubList",
          p1: this.$store.state.supinfo.accountid || "",
          p2: this.$store.state.token || "",
          p3: this.purchasematterid || "",
          p4: this.page,
          p5: this.pageSize
        },
        res => {
          this.loading = false;
          //   console.log(res);
          this.tableData = res["data"];
          if (this.tableData.length > 0) {
            this.totalSize = parseInt(this.tableData[0]["totalcount"]);
          }
        }
      );
    },
    showMoney(item) {
      this.$set(item, "showmoney", true);
    },
    newPriceBid(item) {
      this.dialogFormVisible = true;
    },
    commit() {}
  }
};
</script>
<style lang="scss" scoped>
</style>


