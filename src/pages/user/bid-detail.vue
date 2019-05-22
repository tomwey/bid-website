<template>
  <div class="bid-detail" v-loading="loading">
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: fromPath }">招标事项列表</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="maincontent">
      <div class="bid-info">
        <h2 class="title">{{notice.noticetitle}}</h2>
        <div class="summary">
          <span class="date">发布日期: {{notice.publishdate}}</span>&emsp;
          <span class="company">招标单位: {{notice.tenderingunitname}}</span>&emsp;
          <span class="view-count">浏览次数: {{notice.scannum}}</span>
        </div>
        <div class="apply-wrapper">
          <p class="end-date-tip">
            <count-down prefix="距离投标截止日期还剩" :time="minEndDate" no-time-left="投标已截止"></count-down>
          </p>
        </div>
      </div>
      <div class="step-bar-wrap">
        <el-steps :active="active" align-center finish-status="success">
          <el-step
            v-for="item in steps"
            :title="item.title"
            :description="item.desc"
            :key="item.step"
            :class="{selected:step === item.step}"
            @click.native="selectStep(item)"
          ></el-step>
        </el-steps>
      </div>
      <div class="step-content">
        <files-download
          v-if="step == '5'"
          :noticeid="noticeID"
          :purchasematterid="purchasematterID"
        ></files-download>
        <faq-list
          v-if="step == '510'"
          :enddate="currEndDate"
          :noticeid="noticeID"
          :purchasematterid="purchasematterID"
        ></faq-list>
        <bonds-list v-if="step == '90'" :noticeid="noticeID" :purchasematterid="purchasematterID"></bonds-list>
        <tech-bid
          v-if="step == '520'"
          :bidreid="notice.bidreid"
          :noticeid="noticeID"
          :enddate="currEndDate"
          :purchasematterid="purchasematterID"
        ></tech-bid>
        <business-bid
          v-if="step == '525'"
          :bidreid="notice.bidreid"
          :noticeid="noticeID"
          :purchasematterid="purchasematterID"
        ></business-bid>

        <discuss-bid
          v-if="step == '530' || step == '535'"
          :bidreid="notice.bidreid"
          :noticeid="noticeID"
          :purchasematterid="purchasematterID"
        ></discuss-bid>

        <results-bid v-if="step == '10'" :noticeid="noticeID" :purchasematterid="purchasematterID"></results-bid>

        <!-- <div v-if="step === 7" class="bid-result" style="padding: 30px;">
          <el-table key="bidResultTable" :data="bidResultData" stripe style="width: 100%">
            <el-table-column label="投标事项名称" prop="title"></el-table-column>
            <el-table-column label="通知书附件" width="160">
              <template slot-scope="scope">
                <a
                  style="color: rgb(231,90,22); text-decoration: underline;cursor:pointer;"
                  :href="scope.row.url"
                  target="_blank"
                >附件</a>
              </template>
            </el-table-column>
            <el-table-column label="是否中标" width="120">
              <template slot-scope="scope">
                <el-tag type="danger" v-if="!scope.row.status">未中标</el-tag>
                <el-tag type="success" v-if="scope.row.status">已中标</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>-->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "bid-detail",
  components: {
    formFields: function(resolve) {
      require(["@/components/profile/form-fields"], resolve);
    },
    countDown: function(resolve) {
      require(["@/components/count-down"], resolve);
    },
    filesDownload: function(resolve) {
      require(["@/components/bid/files-download"], resolve);
    },
    faqList: function(resolve) {
      require(["@/components/bid/faq-list"], resolve);
    },
    bondsList: function(resolve) {
      require(["@/components/bid/bonds-list"], resolve);
    },
    techBid: function(resolve) {
      require(["@/components/bid/tech-bid"], resolve);
    },
    businessBid: function(resolve) {
      require(["@/components/bid/business-bid"], resolve);
    },
    discussBid: function(resolve) {
      require(["@/components/bid/discuss-bid"], resolve);
    },
    resultsBid: function(resolve) {
      require(["@/components/bid/results-bid"], resolve);
    }
  },
  data() {
    return {
      active: 1,
      step: "5",
      notice: {},
      steps: [],
      minEndDate: null,
      currEndDate: null,
      loading: false,
      // bidreid: null,
      bidResultData: [
        {
          title: "《合能.深圳中央花园商业及住宅维修整改工程招标",
          status: true
        },
        {
          title: "《合能.深圳中央花园商业及住宅维修整改工程招标",
          status: false
        }
      ]
    };
  },
  computed: {
    fromPath() {
      return localStorage.getItem("from");
    },
    noticeID() {
      const id = this.$route.params.id;
      const arr = id.split("-");
      if (arr.length > 0) {
        return arr[0];
      }

      return "";
    },
    purchasematterID() {
      return this.notice.purchasematterid || "0";
    },
    shortlistID() {
      const id = this.$route.params.id;
      const arr = id.split("-");
      // console.log(arr);
      if (arr.length >= 4) {
        return arr[3];
      }

      return "0";
    },
    specialTypeID() {
      const id = this.$route.params.id;
      const arr = id.split("-");
      if (arr.length >= 5) {
        return arr[4];
      }

      return "0";
    }
  },
  mounted() {
    this.loadBidDetail();
    // this.loadBidPlan();
  },
  methods: {
    getCurrentStep() {
      let id = this.$route.params.id;
      let arr = id.split("-");
      // let currentStep = 1;
      if (arr.length >= 3) {
        return parseInt(arr[2]);
      }
      return 1;
    },
    loadBidPlan() {
      this.$post(
        {
          action: "P_SUP_Bid_GetBidPlan",
          p1: this.$store.state.supinfo.accountid || "",
          p2: this.$store.state.token || "",
          p3: this.noticeID || "",
          p4: this.purchasematterID || ""
        },
        res => {
          // console.log(res);
          this.loading = false;
          if (res.code == "0") {
            let arr = res.data;
            let temp = [];
            let index = 0;
            let activeIndex = 0;

            let compareDates = [];
            // let stepIndex = 0;
            arr.forEach(ele => {
              let time = ele.factenddate || ele.enddate;
              if (time.indexOf(" ") !== -1) {
                let arr = time.split(" ");
                if (arr.length > 0) {
                  time = arr[0];
                }
              }
              temp.push({
                title: ele.stagename,
                desc: `${time}截止`,
                step: ele.bidstage,
                enddate: ele.enddate
              });
              if (ele.factstatenum == "40") {
                // 已完成
                activeIndex++;
              }

              if (
                ele.bidstage == "520" ||
                ele.bidstage == "525" ||
                ele.bidstage == "535"
              ) {
                compareDates.push(ele.enddate);
              }
            });
            this.steps = temp;

            compareDates = compareDates.sort();
            if (compareDates.length > 0) {
              this.minEndDate = compareDates[0];
            }

            this.active = activeIndex;
            if (this.active < this.steps.length) {
              this.step = this.steps[this.active].step;
            }
          }
        }
      );
    },
    loadBidDetail() {
      this.loading = true;
      this.$post(
        {
          action: "P_SUP_Bid_GetBidDetail",
          p1: this.$store.state.supinfo.accountid || "",
          p2: this.$store.state.token || "",
          p3: this.noticeID || "",
          p4: this.purchasematterID || "",
          p5: this.shortlistID || "0",
          p6: this.specialTypeID
        },
        res => {
          if (res.code == "0") {
            if (res.data.length > 0) {
              this.notice = Object.assign({}, res.data[0]);
            }
          }
          this.loadBidPlan();
        }
      );
    },
    selectStep(item) {
      this.step = item.step;
      this.currEndDate = item.enddate;
      // console.log(item);
    },
    showMoney(item) {
      this.$set(item, "showmoney", true);
    }
  }
};
</script>
<style lang="scss" scoped>
.bid-detail {
  .breadcrumb-wrapper {
    background: #fff;
    padding: 15px;
    margin-bottom: 15px;
  }

  .maincontent {
    background: #fff;
    min-height: 668px;
    width: 100%;
  }

  .step-bar-wrap {
    padding: 30px 20px;
  }

  .bid-info {
    margin-top: 20px;
    padding: 30px 15px 10px;
    background: #fff;
    // min-height: 660px;
    .title {
      text-align: center;
      font-size: 24px;
      color: #333;
    }
    .summary {
      text-align: center;
      padding: 15px;
      font-size: 14px;
      color: #999;
      margin-bottom: 20px;
    }
    .apply-wrapper {
      text-align: center;
      .end-date-tip {
        font-size: 16px;
        text-align: center;
        color: #333;
        padding: 0 20px;
      }
      .countdown {
        color: rgb(231, 90, 22);
      }
    }
  }
}

.bid-money {
  // padding: 30px 0;
  padding-right: 60px;
}
</style>
<style lang="scss">
.page-container {
  text-align: center;
  padding: 30px;
  background: #fff;
}

.stat-newbar {
  padding: 15px;
  border-bottom: 1px solid #f2f2f2;
  .stat {
    display: inline-block;
    height: 44px;
    line-height: 44px;
    padding: 0 10px;
  }
}
.list {
  padding: 0 10px;
}

.el-step__head.is-process {
  color: rgb(231, 90, 22);
  border-color: rgb(231, 90, 22);
}

.el-step__title.is-process,
.el-step__description.is-process {
  color: rgb(231, 90, 22);
}

.el-step__description {
  padding: 0 10px !important;
}

.el-step {
  &:hover {
    cursor: pointer;
    .el-step__main {
      background: #f2f2f2;
      padding-bottom: 5px;
    }
  }
  &.selected {
    .el-step__main {
      background: #f2f2f2;
      padding-bottom: 5px;
      position: relative;
      &::after {
        content: " ";
        display: block;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAHZ0lEQVR4Xu3dv44jRRSF8ekEIaG1eBRiMgJIIOFJSSCBgIyYR0EeISGSRiPNomHZmWpfV/W/89uEoHx7fb5TH9ezK8z04BcCCLxKYMIGAQReJ0AQtwOBNwgQxPVAgCDuAAI1AjZIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBoBgtS4mQohQJCQosWsESBIjZupEAIECSlazBqBLoLM8/z59Xr9dZqmL2pvwxQC/QjM8/z75XL5apqmP+59ahdBnt4ESe6twnwPAj3leHo/3QQhSY96PeMeAr3l6C4ISe6p1+w9BEbIMUQQktxTs9kKgVFyDBOEJJWazVQIjJRjqCAkqdRt5hYCo+UYLghJbqnba28hsIYcqwhCkltq99olBNaSYzVBSLKkdq9ZQmBNOVYVhCRL6veatwisLcfqgpCEAFUCW8ixiSAkqV6R3Lmt5NhMEJLkXvZbk28px6aCkOTWq5L3+q3l2FwQkuRd+qWJ9yDHLgQhydIrk/O6vcixG0FIknP5W0n3JMeuBCFJ6+qc/3xvcuxOEJKcX4LXEu5Rjl0KQpI8SfYqx24FIUmOJHuWY9eCkOT8kuxdjt0LQpLzSnIEOQ4hCEnOJ8lR5DiMICQ5jyRHkuNQgpDkFJL89u7du297fOPhWjS6fnHcGm/aNziuQXnI7/EkxzfTNP055OmDHno4QWySQTdh7GMPKcfhPmK97NAmGXujOz79sHIcWhCbpOMVHveoQ8txeEHeS/L4+PjTw8PDl+N69uQCgcPLcQpBniX57PHx8WeSFK7xmJFTyHEaQUgy5pYXn3oaOU4lCEmK17nv2KnkOJ0gJOl722982unkOKUgJLnxWvd5+SnlOK0gJOlz6xc+5bRynFoQkiy83ve97NRynF4Qktx3+xvTp5cjQhCSDJEkQo4YQUjSVZIYOaIEIUkXSaLkiBOEJHdJEidHpCAkKUkSKUesICS5SZJYOaIFIckiSaLliBeEJG9KEi8HQZ7vxzzP/nuS/7pCjmceh/zShkUfDm58EUn+BUaOF3eHIC9gkOSBHB/8i5UgHwAJloQcH/nUQZCPQAmUhByvfCQnyCtggiQhxxs/rxLkDTgBkpCj8Yc5BGkAOrEk5FjwJ50EWQDphJKQY0Hv/qJwIaST/Y07OW7o3Qa5AdYJNgk5bujbBrkR1pE3yTzPv1wul++P9v/nKFTUdcQGKeA82iZ5luO7aZr+LsSNHiFIsf6jSEKOYsHPYwS5g9/eJSHHHeUS5H54e/6ZhBx9+rVBOnDc2yYhR4dSbZB+EPe0ScjRt1cbpCPPrTcJOTqWaYP0h7nlJiHHmD5tkAFcnzbJ9Xr9YZqmrwc8/n+PJMc4ygQZxHae50+u1+uPoyUhx6ACfcQaC/b549ZQScgxvkMbZDDjUZuEHIOLs0HWATxik5Bjve5skJVY99ok5FipMBtkXdA9Ngk51u/MBlmZeXWTkGPlomyQbYBXNgk5tuvKBtmI/dJNQo6NCrJBtgW/ZJOQY/uObJCNO3htk5Bj42JskH0U8LFNQo79dGOD7KSL95vk6e1cLhdfsLCTXgiykyKeN8mnT/+cpumvHb2t6LdCkOj6hW8RIEiLkPNoAgSJrl/4FgGCtAg5jyZAkOj6hW8RIEiLkPNoAgSJrl/4FgGCtAg5jyZAkOj6hW8RIEiLkPNoAgSJrl/4FgGCtAg5jyZAkOj6hW8RIEiLkPNoAgSJrl/4FgGCtAg5jyZAkOj6hW8RIEiLkPNoAgSJrl/4FgGCtAg5jyZAkOj6hW8RIEiLkPNoAgSJrl/4FgGCtAg5jyZAkOj6hW8RIEiLkPNoAgSJrl/4FgGCtAg5jyZAkOj6hW8RIEiLkPNoAgSJrl/4FgGCtAg5jyZAkOj6hW8RIEiLkPNoAgSJrl/4FgGCtAg5jyZAkOj6hW8RIEiLkPNoAgSJrl/4FgGCtAg5jyZAkOj6hW8RIEiLkPNoAgSJrl/4FgGCtAg5jyZAkOj6hW8RIEiLkPNoAgSJrl/4FgGCtAg5jyZAkOj6hW8RIEiLkPNoAgSJrl/4FgGCtAg5jyZAkOj6hW8RIEiLkPNoAv8AFnp19vd60RMAAAAASUVORK5CYII=);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: left top;
        width: 20px;
        height: 20px;
        position: absolute;
        bottom: -13px;
        left: 50%;
        margin-left: -10px;
      }
    }
  }
}
</style>



