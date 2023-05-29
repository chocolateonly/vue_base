const pageSize = 15
export default {
  data() {
    return {
      search: {
        keyword: ''
      },
      tableData: [],
      // tableData: [{
      //   'id': 28,
      //   'create_time': '2023-05-16 12:05:38',
      // }],
      isLoading: false,
      tableHeight: window.innerHeight - 180 - 150,
      page: 1,
      pageSize: pageSize,//15,
      total: 0,//总条数
      minTotalPageSize: pageSize,
      pageSizes: [1, 10, 15, 30, 50],
      isInit: true
    };
  },
  beforeMount() {
    if (this.isInit) this.onInit()
  },
  methods: {
    handleSizeChange(newSize) {
      this.page = 1;
      this.pageSize = newSize;
      this.getTableData();
    },
    handleCurrentChange(newPage) {
      this.page = newPage;
      this.getTableData();
    },
    //初始化page
    onSearch() {
      this.pageSize = pageSize;
      this.page = 1;
      this.getTableData();
    },
    //初始化所有参数
    onInit() {
      this.search.keyword = '';
      this.onSearch();
    },
  }
};
