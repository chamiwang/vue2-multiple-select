Vue.component('chami-type-manual', {
    props:['title','init_items','name','all_list'],
    data:function () {
        return  {
            honor_list:[],
            require:true,
        }
    },
    template: `
          <div class="form-group pt-3 pl-3">
              <label  class="col-form-label">{{ title }}<span class="require-mark">*</span></label>
              
                <div v-for="part,index in honor_list" class="row pb-2">
                    <div class="col-11 pt-2 "><span class="pl-3">第{{ index+1 }}项:</span> </div>
                    <div class="col-1 pt-2"><span class="pt-2 select-vue-close-btn" @click="removeHonorTitle(index)" v-if="honor_list.length >1"><i class="pl-5 ion-close-circled"></i></span></div>
                    <div class="col-6">
                        <el-select @change="getSecondHonorList(part)"  v-model="part.first_level" :name="name+'['+index+'][]'" id="select-{*$name*}" class="custom-select" filterable >
                
                
                        <el-option value="">请选择...</el-option>
                
                        <el-option v-for="item,index in all_list[0]"
                
                                   :key="item"
                                   :label="item.label"
                                   :value="item"
                        >
                        </el-option>
                        </el-select>
                    </div>
                
                    <div class="col-6 province-input" v-if="part.first_level == '省部级'">
                        <el-input :name="name+'['+index+'][]'" v-model="part.second_level" placeholder="请填写"></el-input>
                    </div>
                    <div class="col-6" v-if="part.first_level == '国家级'" :name="name+'['+index+'][]'">
                        <el-select   v-model="part.second_level" :name="name+'['+index+'][]'"  class="custom-select" filterable>
                
                
                        <el-option value="">请选择...</el-option>
                
                        <el-option v-for="item,index in all_list[1]"
                
                                   :key="item"
                                   :label="item.label"
                                   :value="item"
                        >
                        </el-option>
                
                        </el-select>
                    </div>
                </div>
                <div class="d-flex justify-content-center bd-highlight m-3">
                    <a v-if="honor_list.length <= 8" class="btn btn-success" @click="createHonorTitle()">添加一项</a>
                </div>
           </div>
    `,

    mounted() {

        if(this.init_items.length > 0){
            for (let key in this.init_items){
                let item = this.init_items[key];

                this.initHonorTitle(item[0],item[1]);
            }

        }else{
            this.createHonorTitle();
        }

    },
    methods: {
        HonorTitle:function(first_level,second_level){
            this.first_level = first_level?first_level:'';
            this.second_level = second_level?second_level:'';

        },
        initHonorTitle:function(first,second){
            let honor_level = new this.HonorTitle(first,second);
            if(this.honor_list.length<this.init_items.length){
                this.honor_list.push(honor_level);
            }

        },

        createHonorTitle:function(){
            let honor_level = new this.HonorTitle();
            this.honor_list.push(honor_level);
        },

        removeHonorTitle:function(index){
            this.honor_list.splice(index,1);
        },

        getFirstHonorList:function(){
            return ['国家级','省部级','无'];
        },
        getSecondHonorList:function(part,init){
            part.second_level = '';
        },
    },


})