<template>
  <el-button type="primary" @click="getLayout">点击获取layout图</el-button>
</template>
<script>
import $ from 'jquery'
export default {
  methods: {
    getLayout() {
      //project\src\static\style.json
      $.ajax({
        url: '/public/static/data/pu1-assy.json', //同文件夹下的json文件路径
        type: "GET", //请求方式为get
        dataType: "json", //返回数据格式为json
        success: function (data) {
          //请求成功完成后要执行的方法
          console.log(data);
          for (var i = 0; i < data.length; i++) {
            var obj = document.createElement("div");
            obj.setAttribute("id", data[i].name);
            obj.style.backgroundColor = data[i].color; //配置初始颜色
            //obj.innerText=data[i].name+":"+data[i].status;
            // obj.innerText = data[i].title;
            obj.style.fontSize = "3px";
            obj.style.position = data[i].position;
            obj.style.left = data[i].left;
            obj.style.top = data[i].top;
            obj.style.width = data[i].width;
            obj.style.height = data[i].height;
            obj.style.borderStyle = "solid";
            obj.style.borderWidth = "1px";
            obj.title = data[i].name;
            obj.addEventListener("click", function (e) {
              //alert(this.getAttribute("id"));
              var xhttp = new XMLHttpRequest();
              xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                  document.getElementById("machine_content").innerHTML =
                    this.responseText;
                }
              };
              xhttp.open(
                "GET",
                "/machine/" + this.getAttribute("id") + ".html",
                true
              );
              xhttp.send();
            });
            document.body.appendChild(obj);
            console.log(data[i].name);
          }
        },
      });
      this.disabled = true;
    },
  },
};
</script>

<style scoped></style>
