import React, { Component } from "react";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import PropTypes from 'prop-types';
import "./chart.less";
import ReactEcharts from "echarts-for-react";

export default class Echarts extends Component {
    static propTypes = {
        markPosition: PropTypes.string,
        seriesType: PropTypes.string,
        seriesName: PropTypes.string,
        legendData: PropTypes.array,
        xAxisName: PropTypes.string,
        xAxisData:  PropTypes.array,
        xAxisType: PropTypes.string,
        yAxisType: PropTypes.string,
        titleText: PropTypes.string,
        seriesData: PropTypes.array,
        color: PropTypes.array,
    };

    static defaultProps = {
        markPosition: 'top',
        seriesType: 'bar',
        seriesData: [10, 40, 32, 20, 80, 90, 97],
        titleText: '笔数',
        yAxisType: 'value',
        xAxisType: 'category',
        seriesName: '笔数',
        legendData: ['笔数'],
        xAxisName: '法院',
        xAxisData: ["A级", "B级", "C级", "D级", "E级", "F级", "G级"],
        color: ["rgb(216, 151, 235)"]
    };
  constructor(props) {
    super(props);
    this.state = {};
  }
  getOption() {
    const { markPosition, seriesType, color, seriesData, titleText, yAxisType, xAxisType, seriesName, legendData, xAxisName, xAxisData } = this.props;
    let option = {
      backgroundColor: "#fff",
      color: color,
      title: [
        {
          text: titleText,
          left: "2%",
          top: "6%",
          textStyle: {
            fontWeight: "normal"
          }
        }
      ],
      tooltip: {
        trigger: "axis"
      },
      grid: {
        left: "6%",
        width: "90%"
      },
      legend: {
        top: "0%",
        left: "2%",
        itemWidth: 12,
        itemHeight: 12,
        textStyle: {
          color: "gray",
        },
        data: legendData
      },
      xAxis: {
        type: xAxisType,
        name: xAxisName,
        data: xAxisData,
      },
      yAxis: {
        type: yAxisType,
      },
      series: [
        {
          name: seriesName,
          type: seriesType,
          data: seriesData,
          itemStyle: {
            normal: {
              label: {
                show: true,
                position: markPosition,
                textStyle: {
                  color: "#615a5a"
                },
                formatter: function(params) {
                  if (params.value == 0) {
                    return "";
                  } else {
                    return params.value;
                  }
                }
              }
            }
          }
        }
      ]
    };
    return option;
  }
  render() {
    return (
      <div>
        {/* <BreadcrumbCustom paths={["首页", "图表", "echarts"]} /> */}
        <div className="echarts">
          <ReactEcharts option={this.getOption()} />
        </div>
      </div>
    );
  }
}
