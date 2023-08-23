Array.prototype.indexOf = function(val) {

    for (var i = 0; i < this.length; i++) {

        if (this[i] == val) {

            return i;

        };

    }

    return -1;

};



//根据数组的下标，删除该下标的元素

Array.prototype.remove = function(val) {

    var index = this.indexOf(val);

    if (index > -1) {

        this.splice(index, 1);

    }

};
Vue.component('chami-multiple-group', {
    props:['title','init_items','name','all_list','chami_type','unique_first_level'],
    data:function () {
        return  {
            level_list:[],
            first_unique_list:[],
            first_unique_select_part_list:[],
            unique_i:0,
            now_dataset: {},
            require:true,
        }
    },
    template: `
          <div class="form-group pt-3 pl-3">
          <label  class="col-form-label">{{ title }}<span class="require-mark">*</span></label>

          <div v-for="part,index in level_list" class="row  pb-2">
            <div class="col-11 pt-2 "><span class="pl-3">第{{ index + 1 }}项:</span></div>
            <div class="col-1 pt-2"><span class="pt-2 select-vue-close-btn" @click="removePositionLevel(index)"
                                          v-if="level_list.length >1"><i class="pl-5 ion-close-circled"></i></span>
            </div>

            <div class="col-4">
              <el-select @change="getSecondLevelList(part)" v-model="part.first_level" :name="name+'['+index+'][]'"
                         :id="'select-'+name" class="custom-select" filterable>


              <el-option value="">请选择...</el-option>

              <el-option v-for="item,index in part.first_level_list"

                         :key="item"
                         :label="item.label"
                         :value="item"
                         :disabled="getFirstDisabled(part,item)"
              >
              </el-option>

              </el-select>
            </div>


            <div class="col-4">
              <el-select @change="getThirdLevelList(part)" v-model="part.second_level" :name="name+'['+index+'][]'"
                         class="custom-select" filterable
              >


              <el-option value="">请选择...</el-option>

              <el-option v-for="item,index in part.second_level_list"

                         :key="item"
                         :label="item.label"
                         :value="item"
              >
              </el-option>
              </el-select>


            </div>
            <div class="col-4">
              <el-select @change="ThirdChange(part)" v-model="part.third_level"  :name="name+'['+index+'][]'" class="custom-select" :multiple="chami_type == 3" filterable default-first-option allow-create 
          >


              <el-option value="">请选择...</el-option>

              <el-option v-for="item,index in part.third_level_list"

                         :key="item"
                         :label="item"
                         :value="item"
              >
              </el-option>
              </el-select>
              <el-input v-model="part.multi_third_level" :name="name+'['+index+'][]'" v-if="chami_type == 3" type="hidden" placeholder="请填写"></el-input>

            </div>
          </div>
          <div class="d-flex justify-content-center bd-highlight m-3">
            <a v-if="level_list.length <=4" class="btn btn-success" @click="createPositionLevel()">添加一项</a>
          </div>
          </div>`,
    mounted() {
        if(this.init_items.length > 0){
            for (let key in this.init_items){
                let item = this.init_items[key];
                let type = this.chami_type;
                this.initPositionLevel(item[0],item[1],item[2],type);
            }

        }else{
            this.createPositionLevel();
        }
    },
    methods: {
        getFirstDisabled:function(part,item){
            if(this.unique_first_level === true){
                return this.first_unique_list.includes(item);
            }
            return false;
        },
        PositionalLevel:function(first_level, second_level, third_level,type,key) {
            this.multi_third_level='';

            if(type == 3){
                this.multi_third_level=third_level;
                if(third_level && third_level.indexOf('#',0) >=0){
                    third_level=third_level.split('#');
                }else if(third_level){
                    third_level=[third_level];
                }
            }
            this.key=key;
            this.first_level = first_level?first_level:'';
            this.second_level = second_level?second_level:'';
            this.third_level = third_level?third_level:'';
            this.first_level_list = [];
            this.second_level_list=[];
            this.third_level_list=[]

        },
        initPositionLevel:function(first,second,third,type){
            let position_level = new this.PositionalLevel(first,second,third,type,this.unique_i++);

            position_level.first_level_list = this.getFirstLevelList();
            this.getSecondLevelList(position_level,true);
            this.getThirdLevelList(position_level,true);
            if(this.level_list.length<this.init_items.length){
                this.level_list.push(position_level);
            }
        },

        createPositionLevel:function(){
            let position_level = new this.PositionalLevel('','','',0,this.unique_i++);
            position_level.first_level_list = this.getFirstLevelList();
            this.level_list.push(position_level);
        },

        removePositionLevel:function(index){
            this.level_list.splice(index,1);
        },

        getFirstLevelList:function(){
            return [...this.all_list.keys()];
        },

        getSecondLevelList:function(part,init){

            //unique only
                if(this.first_unique_select_part_list.includes(part.key) && !init){
  /*                  console.log('same_reselect')*/
                    this.first_unique_list.remove(this.now_dataset[part.key])
                    this.now_dataset[part.key]=part.first_level;
                    this.first_unique_list.push(part.first_level)
/*                    console.log(this.first_unique_list)*/
                }else{
                    this.now_dataset[part.key]=part.first_level;
                    this.first_unique_select_part_list.push(part.key)
                    this.first_unique_list.push(part.first_level)
                }

            //
            if(!init){
                part.second_level = '';
                part.third_level = '';
                part.third_level_list = [];
            }

            if(!part.first_level){
                part.second_level_list = [];
            }else{
                part.second_level_list =  [...this.all_list.get(part.first_level).keys()];
            }

        },
        getThirdLevelList:function(part,init){
            if(!init) {
                part.third_level = '';
            }
            if(!part.second_level){
                part.third_level_list = [];
            }else{
                part.third_level_list =  this.all_list.get(part.first_level).get(part.second_level)
            }
        },
        ThirdChange:function(part){
            if(part.third_level instanceof Array){
                part.multi_third_level = part.third_level.join('#')
            }
        }
    },
})