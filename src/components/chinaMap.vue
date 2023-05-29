<template>
    <div class="content">
        <div ref="charts" style="width: 100%;height: 100%"></div>
    </div>
</template>


<script>
import * as echarts from "echarts";
import axios from 'axios'
const publicUrl = 'https://geo.datav.aliyun.com/areas_v2/bound/'
export default {
    name:'chinaMap',
    data(){
        return{
            mapData : [{
                name: "河南省",
                value: 1000
            },
                {
                    name: "山东省",
                    value: 500
                },
                {
                    name: "安徽省",
                    value: 700
                },
                {
                    name: "山西省",
                    value: 200
                },
                {
                    name: "湖南省",
                    value: 600
                },
                {
                    name: "四川省",
                    value: 1600
                }
            ],

        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initCharts();
        })
    },
    methods: {
        //获取地图json数据
        async getGeoJson(jsonName) {
            return await axios.get(publicUrl + jsonName)
        },
        //画图
        async initCharts() {
            let chinaGeoJson = await this.getGeoJson('100000_full.json')
            chinaGeoJson = chinaGeoJson.data
            const mapName = 'china'
            const charts = echarts.init(this.$refs["charts"]);

            // 地图注册，第一个参数的名字必须和option.geo.map一致
            echarts.registerMap(mapName, chinaGeoJson)

            const option = {
                // 背景颜色
                backgroundColor: "#404a59",
                // 提示浮窗样式
                tooltip: {
                    show: true,
                    trigger: "item",
                    alwaysShowContent: false,
                    backgroundColor: "#0C121C",
                    borderColor: "rgba(0, 0, 0, 0.16);",
                    hideDelay: 100,
                    triggerOn: "mousemove",
                    enterable: true,
                    textStyle: {
                        color: "#DADADA",
                        fontSize: "12",
                        width: 20,
                        height: 30,
                        overflow: "break",
                    },
                    showDelay: 100
                },
                // 地图配置
                geo: {
                    map: mapName,
                    // 开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
                    roam: true,
                    label: {
                        // 通常状态下的样式
                        normal: {
                            show: true,
                            textStyle: {
                                color: "#fff",
                            },
                        },
                        // 鼠标放上去的样式
                        emphasis: {
                            textStyle: {
                                color: "#fff",
                            },
                        },
                    },
                    //地图区域的样式设置
                    itemStyle: {
                        normal: {
                            borderColor: "rgba(147, 235, 248, 1)",
                            borderWidth: 1,
                            areaColor: {
                                type: "radial",
                                x: 0.5,
                                y: 0.5,
                                r: 0.8,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: "rgba(147, 235, 248, 0)", // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: "rgba(147, 235, 248, .2)", // 100% 处的颜色
                                    },
                                ],
                                globalCoord: false, // 缺省为 false
                            },
                            shadowColor: "rgba(128, 217, 248, 1)",
                            shadowOffsetX: -2,
                            shadowOffsetY: 2,
                            shadowBlur: 10,
                        },
                        // 鼠标放上去高亮的样式
                        emphasis: {
                            areaColor: "#389BB7",
                            borderWidth: 0,
                        },
                    },
                },
                //进行气泡标点
                series: [{
                    type: 'map',
                    map: this.mapData,
                    geoIndex: 0,
                    aspectScale: 0.75, //长宽比
                    showLegendSymbol: false, // 存在legend时显示
                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: false,
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    },
                    roam: true,
                    itemStyle: {
                        normal: {
                            areaColor: '#031525',
                            borderColor: '#3B5077',
                        },
                        emphasis: {
                            areaColor: '#2B91B7'
                        }
                    },
                    animation: true,
                    data: this.mapData
                },
                    {
                        name: '散点', // 自定义名称
                        type: 'effectScatter', // scatter  effectScatter
                        coordinateSystem: 'geo', // 设置坐标系类型
                        data: this.convertData(chinaGeoJson,this.mapData), // 设置散点位置和数据
                        symbolSize: function (val) { // 设置散点大小
                            return 15
                        },
                        showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        hoverAnimation: true, // 是否显示鼠标悬浮动画
                        label: {
                            // 静态显示时的样式
                            normal: {
                                show: true, // 显示地区名称
                                formatter: function (data) { // 显示模板
                                    return data.value[2]
                                },
                                position: 'bottom', // 显示位置

                            },
                            // 鼠标悬浮上去的样式
                            emphasis: {
                                show: true, // 显示地区名称
                                color: "red",
                            },
                        },
                        itemStyle: {
                            normal: {
                                color: function (res) {
                                    let value = res.value[2]
                                    //根据value值对标点进行不同颜色显示
                                    if (value < 500) {
                                        return '#ff3859'
                                    } else if (value < 1000) {
                                        return '#4ed7fa'
                                    } else if (value < 1500) {
                                        return '#fac531'
                                    } else {
                                        return '#01ff5b'
                                    }
                                },
                                shadowBlur: 10,
                            },
                            // 鼠标悬浮上去的样式
                            emphasis: {
                                color: "red",
                            },
                        },
                        zlevel: 3
                    }
                ]
            };

            charts.setOption(option);
            charts.on('click', param => {
                console.log(param);
            })
            window.addEventListener("resize", function () {
                charts.resize()
            })
        },
        //标记数据处理
        convertData(geoJson,data){
            //获取当前显示地图下方地市的坐标点数据； 用于气泡显示
            let geoCoordMap = {};
            // 获取地区详细信息
            let mapFeatures = geoJson.features;
            // 遍历获取每个地区的经纬度
            mapFeatures.forEach(function (v, i) {
                // 获取当前地区名
                let name = v.properties.name;
                if (name) {
                    // 获取当前地区的经纬度
                    geoCoordMap[name] = v.properties.center;
                }
            });

            var res = [];
            data.forEach(item => {
                // 获取当前省份的经纬度坐标
                let geoCoord = geoCoordMap[item.name];
                if (geoCoord) {
                    res.push({
                        // name 表示地区名称
                        name: item.name,
                        // value数据格式为：[113.665412, 34.757975, '200']
                        value: geoCoord.concat(item.value)
                    });
                }
            })
            return res;
        }
    },
};
</script>

