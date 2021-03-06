import commonInput from '@/components/commonInput.vue'
import commonTable from '@/components/commonTable.vue'
import http from '@/utils/httpUtil.js'
import { mapActions, mapGetters } from 'vuex'

export default{
    data(){
        return{
            dialogTableVisible:false,
            diaTitle:'',
            queryData:{},
            pager:{
                page:1,
                rows:20
            },
            searchFrom:[
                {
                    label:'会员昵称:',
                    type:'text',
                    value:'nickName',
                    clear:true,
                    search:'like',
                    placeholder:'请输入会员昵称',
                    style:'width:150px'
                },
                {
                    label:'联系方式:',
                    type:'text',
                    value:'mobile',
                    clear:true,
                    search:'like',
                    placeholder:'请输入联系方式',
                    style:'width:150px'
                },
                {
                    type:'select',
                    value:'store_id',
                    label:'所属店铺',
                    search:'eq',
                    placeholder:'请选择',
                    selectFrom:[
           
                    ]
                },
                {
                    type:'date',
                    name:'create_time',
                    search:'between',
                    label:'创建时间',
                },
                
                {
                    type:'btn',
                    btntxt:'搜索',
                    btnType:'primary',
                    value:'search'
                },
                {
                    type:'btn',
                    btntxt:'添加',
                    btnType:'primary',
                    value:'add'
                },
                {
                    type:'btn',
                    btntxt:'重置条件',
                    btnType:'primary',
                    value:'reset'
                },
            ],
            tableData:[],
            columnData:[
                {
                    prop:'nickName',
                    label:'昵称',
                },
                {
                    prop:'identity',
                    label:'身份',
                },
                {
                    prop:'post_share_key',
                    label:'商家识别码',
                },
                {
                    prop:'get_share_key',
                    label:'商家会员识别码',
                },
                {
                    prop:'mobile',
                    label:'联系方式',
                },
                {
                    prop:'create_time',
                    label:'创建时间',
                },
               
            ],
            count:0,
            options:{
                selection:false,  //是否开启多选
                width:200,    //操作栏长度
                operation:[
                    {type:'primary',name:'编辑',value:'edit'},
                    {type:'danger',name:'删除',value:'del'}
                ]
            },
            storeList:[],
            //表单选择数据
            selectOption:[],
            storeData:{}
        }
    },
    components:{
        commonInput,
        commonTable
    },
    computed: {
        ...mapGetters([
            'getUserInfo',
        ])
      },
    created(){
        this.getData({})
        this.getStoreList()
    },
    methods:{
        //搜索
        search(data){
            this.queryData= data 
            this.pager.page=1
            this.pager.rows=20
            this.getData(data)
        },
        getData(data){
            data.page=this.pager.page
            data.row=this.pager.rows
            data.store_id= data.store_id?data.store_id[1]:'' || Number(this.getUserInfo.userInfo.store_id)
            http.post("/member/memberList",data,(res)=>{
                res.memberList.forEach(item=>{
                    if(item.post_share_key){
                        item.identity='商家-'+item.store_name
                    }else if(item.get_share_key){
                        item.identity='商家会员-'+item.store_name
                    }
                })
                this.tableData=res.memberList
                this.count=res.count
            })
        },
        getStoreList(){
            http.post('/store/storeList',{},(res)=>{
                if(res){
                    this.storeList=res.storeList
                    let arr=[]
                    res.storeList.forEach(item=>{
                        if(item.store_name){
                            arr.push({
                                label:item.store_name,
                                value:item.store_id,
                            })
                        }
                    })
                    let sid=Number(this.getUserInfo.userInfo.store_id) 
                    if(sid===1){
                        arr.forEach(i=>{
                            this.searchFrom[2].selectFrom.push(i)
                        })
                    }else{
                        this.searchFrom[2].selectFrom=arr.filter(item=>{
                            return sid==item.store_id
                        })
                        arr.forEach(i=>{
                            if(sid==i.value){
                                this.searchFrom[2].selectFrom.push(i)
                            }
                        })
                    }
                }
            })
        },
        //单个修改
        edit(data){
            this.dialogTableVisible=true
            this.diaTitle='编辑店铺'
            this.storeData=JSON.parse(JSON.stringify(data))
        },
        closeDia(formName){
            this.dialogTableVisible=false
            this.$refs[formName].resetFields();
        },
        //选择
        select(data){
            this.selectOption=JSON.parse(JSON.stringify(data))
        },
        //删除
        del(data){
            this.$confirm('删除后数据无法恢复，请确认是否执行该操作','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                http.post('/store/delStore',{...data},(res)=>{
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                })
                this.getData({})
            })
            
        },

        // 添加
        add(){
            this.dialogTableVisible=true
            this.diaTitle='添加店铺'
        },
        submitForm(){
            let url=''
            if(this.diaTitle=='添加店铺'){
                url='/store/addStore'
            }else{
                url='/store/updateStore'
            }
            http.post(url,{...this.storeData},(res)=>{
                this.$message({
                    type: 'success',
                    message: '操作成功!'
                });
            })
            this.dialogTableVisible=false
            this.getData({})
        },
        
        //分页页码
        currentChange(val){
            this.pager.page=val
            this.getData(this.queryData)
        },
        //页数
        sizeChange(val){
            this.pager.rows=val
            this.getData(this.queryData)
        }
    }
}