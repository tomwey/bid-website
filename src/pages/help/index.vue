<template>
  <div class="home-main-wrap container">
    <div class="help-content">
      <div class="images">
        <img :src="img.src" v-for="(img,index) in images" :key="index">
      </div>
      <div class="last-step">
        <h2>7、联系我们：</h2>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>区域</th>
              <th>联系人</th>
              <th>联系电话</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in contacts" :key="index">
              <td>{{item.area}}</td>
              <td>{{item.name}}</td>
              <td>{{item.phone}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "help",
  data() {
    return {
      images: [],
      contacts: [
        {
          area: "成都",
          name: "张小海",
          phone: "18602877717"
        },
        {
          area: "西安",
          name: "张龙",
          phone: "18142391676"
        },
        {
          area: "长沙",
          name: "管云花",
          phone: "15874193562"
        },
        {
          area: "宁波",
          name: "余云昆",
          phone: "13696506416"
        },
        {
          area: "集团总部",
          name: "王荣锐",
          phone: "15320393328"
        }
      ]
    };
  },
  mounted() {
    for (let i = 1; i <= 19; i++) {
      if (i === 3) {
        continue;
      }
      this.images.push({
        src: require("@/assets/images/help/help-" + i + ".png")
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.images {
  text-align: center;
  width: 100%;
  background: #fff;
  padding: 20px;
  img {
    max-width: 800px;
    height: auto;
  }
}

.last-step {
  width: 620px;
  margin: 0 auto;
  background: #fff;
  h2 {
    font-size: 20px;
    // color: #333;
  }
}

.help-content {
  background: #fff;
  padding-bottom: 30px;
}
</style>


