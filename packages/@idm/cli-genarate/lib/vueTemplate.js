module.exports = (className) => {
    return `<template>
    <div idm-ctrl="idm_module"
    :id="moduleObject.id" 
    :idm-ctrl-id="moduleObject.id" 
    :title="propData.htmlTitle?propData.fontContent:''" 
    v-show="propData.defaultStatus!='hidden'" 
    @click="textClickHandle">
     <!--
       组件内部容器
       增加class="drag_container" 必选
       idm-ctrl-id：组件的id，这个必须不能为空
       idm-container-index  组件的内部容器索引，不重复唯一且不变，必选
     -->
     {{propData.fontContent}}
   </div>
</template>
<script>
export default {
name: '${className}',
data() {
    return {
        moduleObject:{},
        propData:this.$root.propData.compositeAttr||{
            fontContent:"Hello Word"
        }
    }
},
created() {
    this.moduleObject = this.$root.moduleObject
    this.convertAttrToStyleObject();
},
methods: {
    propDataWatchHandle(propData){
        this.propData = propData.compositeAttr||{};
        this.convertAttrToStyleObject();
    },
    convertAttrToStyleObject(){
        var styleObject = {};
        if(this.propData.bgSize&&this.propData.bgSize=="custom"){
          styleObject["background-size"]=(this.propData.bgSizeWidth?this.propData.bgSizeWidth.inputVal+this.propData.bgSizeWidth.selectVal:"auto")+" "+(this.propData.bgSizeHeight?this.propData.bgSizeHeight.inputVal+this.propData.bgSizeHeight.selectVal:"auto")
        }else if(this.propData.bgSize){
          styleObject["background-size"]=this.propData.bgSize;
        }
        if(this.propData.positionX&&this.propData.positionX.inputVal){
          styleObject["background-position-x"]=this.propData.positionX.inputVal+this.propData.positionX.selectVal;
        }
        if(this.propData.positionY&&this.propData.positionY.inputVal){
          styleObject["background-position-y"]=this.propData.positionY.inputVal+this.propData.positionY.selectVal;
        }
        for (const key in this.propData) {
          if (this.propData.hasOwnProperty.call(this.propData, key)) {
            const element = this.propData[key];
            if(!element&&element!==false&&element!=0){
              continue;
            }
            switch (key) {
              case "width":
              case "height":
                styleObject[key]=element;
                break;
            }
          }
        }
        window.IDM.setStyleToPageHead(this.moduleObject.id,styleObject);
        this.initData();
    },
    reload(){
        //请求数据源
        this.initData();
    },
    initData(){
        let that = this;
        //所有地址的url参数转换
        var params = that.commonParam();
        switch (this.propData.dataSourceType) {
          case "customInterface":
            this.propData.customInterfaceUrl&&window.IDM.http.get(this.propData.customInterfaceUrl,params)
            .then((res) => {
              //res.data
              that.$set(that.propData,"fontContent",that.getExpressData("resultData",that.propData.dataFiled,res.data));
              // that.propData.fontContent = ;
            })
            .catch(function (error) {});
            break;
          case "pageCommonInterface":
            //使用通用接口直接跳过，在setContextValue执行
            break;
          case "customFunction":
            if(this.propData.customFunction&&this.propData.customFunction.length>0){
              var resValue = "";
              try {
                resValue = window[this.propData.customFunction[0].name]&&window[this.propData.customFunction[0].name].call(this,{...params,...this.propData.customFunction[0].param,moduleObject:this.moduleObject});
              } catch (error) {
              }
              that.propData.fontContent = resValue;
            }
            break;
        }
      },
      receiveBroadcastMessage(object){
        console.log("组件收到消息",object)
        if(object.type&&object.type=="linkageShowModule"){
          this.showThisModuleHandle();
        }else if(object.type&&object.type=="linkageHideModule"){
          this.hideThisModuleHandle();
        }
      },
      setContextValue(object) {
        console.log("统一接口设置的值", object);
        if (object.type != "pageCommonInterface") {
          return;
        }
        //这里使用的是子表，所以要循环匹配所有子表的属性然后再去设置修改默认值
        if (object.key == this.propData.dataName) {
          // this.propData.fontContent = this.getExpressData(this.propData.dataName,this.propData.dataFiled,object.data);
          this.$set(this.propData,"fontContent",this.getExpressData(this.propData.dataName,this.propData.dataFiled,object.data));
        }
      },
      sendBroadcastMessage(object){
        window.IDM.broadcast&&window.IDM.broadcast.send(object);
    },
}
};
</script>`
}