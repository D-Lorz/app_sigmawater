const year = new Date().getFullYear()
/** ------------- CAPTURANDO DATOS PARA LA GRÁFICA DE VENTAS PROPIAS x VENDEDOR ------------- **/
let valoresJSON1 = [];
const vPropias = [];
valoresJSON1 = $('#json-ventasVendedor').val();
vPropias.unshift({x:year, y:0})
if (valoresJSON1) {
    vPropias.shift()
    valoresJSON1 = JSON.parse(valoresJSON1);
    valoresJSON1.forEach(vp => {
        const temp = vp.numVentas
        vPropias.push({ x:"Hasta: "+vp.fecha, y:temp})
    })
}
vPropias.length == 1 ? vPropias.unshift({x:year, y:0}) : true;
// var minichart1Colors = getChartColorsArray("#chart-ventasPropiasVendedor");
// Plasmando datos a la gráfica 1
var options = {
    series: [{
        data: vPropias
    }],
    "yaxis": [{
        "labels": {
            "formatter": function (val) {
                return val.toFixed(1)
            }
        }
    }],
    chart: {
        type: 'line',
        height: 50,
        sparkline: {enabled: true}
    },
    colors: ["#5156be"],
    stroke: {
        curve: 'smooth',
        width: 2,
    },
    tooltip: {
        fixed: {enabled: false},
        x: {show: true},
        y: {title: {formatter: function (seriesName) {return ''}}},
        marker: {show: false}
    }
};
var chart = new ApexCharts(document.querySelector("#chart-ventasPropiasVendedor"), options);
chart.render();


/** ------------- CAPTURANDO DATOS PARA LA GRÁFICA DE VENTAS AFILIADOS x VENDEDOR ------------- **/
let valoresJSON2 = []
const vAfiliados = []
valoresJSON2 = $('#json-ventasAfiliados').val();
vAfiliados.unshift({x:year, y:0})
if (valoresJSON2) {
    vAfiliados.shift()
    valoresJSON2 = JSON.parse(valoresJSON2);
    console.log("\nDATOS JSON 2 >>>", valoresJSON2)
    valoresJSON2.forEach(va => {
        const temp = va.numVentasAfiliados
        vAfiliados.push({ x:"Hasta: "+va.fecha, y:temp})
    })
}
vAfiliados.length == 1 ? vAfiliados.unshift({x:year, y:0}) : true;
// var minichart2Colors = getChartColorsArray("#chart-ventasAfiliadosVendedor");
// Plasmando datos a la gráfica 2
var options = {
    series: [{
        data: vAfiliados
    }],
    "yaxis": [{
        "labels": {
            "formatter": function (val) {
                return val.toFixed(1)
            }
        }
    }],
    chart: {
        type: 'line',
        height: 50,
        sparkline: {enabled: true}
    },
    colors: ["#5156be"],
    stroke: {
        curve: 'smooth',
        width: 2,
    },
    tooltip: {
        fixed: {enabled: false},
        x: {show: true},
        y: {title: {formatter: function (seriesName) {return ''}}},
        marker: {show: false}
    }
};
var chart = new ApexCharts(document.querySelector("#chart-ventasAfiliadosVendedor"), options);
chart.render();

/** ------------- CAPTURANDO DATOS PARA LA GRÁFICA DE CLIENTES AGREGADOS x VENDEDOR ------------- **/
let valores = []
const datos = []
valores = $('#datosJson_clAgregados').val();
datos.unshift({x:year, y:0})
if (valores) {
    datos.shift()
    valores = JSON.parse(valores);
    valores.forEach(vl => {
        const temp = vl.numClientes
        datos.push({ x:"Hasta: "+vl.fecha, y:temp})
    })
}
datos.length == 1 ? datos.unshift({x:year, y:0}) : true;
// let minichart3Colors = getChartColorsArray("#chart-clientesAgregados");
// Plasmando datos a la gráfica 3
var options = {
        series: [{
            data: datos
        }],
        "yaxis": [{
            "labels": {
                "formatter": function (val) {
                    return val.toFixed(0)
                }
            }
        }],
        chart: {
            type: 'line',
            height: 50,
            sparkline: {
                enabled: true
            }
        },
        colors: ["#5156be"],
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        tooltip: {
            fixed: {
                enabled: false
            },
            x: {
                show: true,
            },

            y: {
                title: {
                    formatter: function (seriesName) {
                        return ''
                    }
                },
            },
            marker: {
                show: false
            }
        }
};
var chart = new ApexCharts(document.querySelector("#chart-clientesAgregados"), options);
chart.render();

/** ------------- CAPTURANDO DATOS PARA LA GRÁFICA DE AFILIADOS AGREGADOS x VENDEDOR ------------- **/
let valoresAfl = []
const datosAfl = []
valoresAfl = $('#datosJson_aflAgregados').val();
datosAfl.unshift({x:year, y:0})
if (valoresAfl) {
    datosAfl.shift()
    valoresAfl = JSON.parse(valoresAfl);
    valoresAfl.forEach(afl => {
        const tempafl = afl.numAfiliados
        datosAfl.push({ x:"Hasta: "+afl.fecha, y:tempafl})
    })
}
datosAfl.length == 1 ? datosAfl.unshift({x:year, y:0}) : true;
// var minichart4Colors = getChartColorsArray("#chart-afiliadosAgregados");
// Plasmando datos a la gráfica 4
var options = {
    series: [{
        data: datosAfl
    }],
    "yaxis": [{
        "labels": {
            "formatter": function (val) {
                return val.toFixed(0)
            }
        }
    }],
    chart: {
        type: 'line',
        height: 50,
        sparkline: {
            enabled: true
        }
    },
    colors: ["#5156be"],
    stroke: {
        curve: 'smooth',
        width: 2,
    },
    tooltip: {
        fixed: {
            enabled: false
        },
        x: {
            show: true
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return ''
                }
            }
        },
        marker: {
            show: false
        }
    }
};
var chart = new ApexCharts(document.querySelector("#chart-afiliadosAgregados"), options);
chart.render();

// 
// Wallet Balance
//
// var piechartColors = getChartColorsArray("#wallet-balance");
// var options = {
//     series: [35, 70, 15],
//     chart: {
//         width: 227,
//         height: 227,
//         type: 'pie',
//     },
//     labels: ['Ethereum', 'Bitcoin', 'Litecoin'],
//     colors: piechartColors,
//     stroke: {
//         width: 0,
//     },
//     legend: {
//         show: false
//     },
//     responsive: [{
//         breakpoint: 480,
//         options: {
//             chart: {
//                 width: 200
//             },
//         }
//     }]
// };

// var chart = new ApexCharts(document.querySelector("#wallet-balance"), options);
// chart.render();


// Invested Overview


// var radialchartColors = getChartColorsArray("#invested-overview");
// var options = {
//     chart: {
//         height: 270,
//         type: 'radialBar',
//         offsetY: -10
//     },
//     plotOptions: {
//         radialBar: {
//             startAngle: -130,
//             endAngle: 130,
//             dataLabels: {
//                 name: {
//                     show: true
//                 },
//                 value: {
//                     offsetY: 10,
//                     fontSize: '18px',
//                     color: undefined,
//                     formatter: function (val) {
//                         return val + "%";
//                     }
//                 }
//             }
//         }
//     },
//     colors: [radialchartColors[0]],
//     fill: {
//         type: 'gradient',
//         gradient: {
//             shade: 'dark',
//             type: 'horizontal',
//             gradientToColors: [radialchartColors[1]],
//             shadeIntensity: 0.15,
//             inverseColors: false,
//             opacityFrom: 1,
//             opacityTo: 1,
//             stops: [20, 60]
//         },
//     },
//     stroke: {
//         dashArray: 4,
//     },
//     legend: {
//         show: false
//     },
//     series: [2],
//     labels: ['Pagado'],
// }

// var chart = new ApexCharts(
//     document.querySelector("#invested-overview"),
//     options
// );

// chart.render();

//
// Market Overview
//
// var barchartColors = getChartColorsArray("#market-overview");
var options = {
    series: [{
        name: 'Profit',
        data: [12.45, 16.2, 8.9, 11.42, 12.6, 18.1, 18.2, 14.16, 11.1, 8.09, 16.34, 12.88]
    }, {
        name: 'Loss',
        data: [-11.45, -15.42, -7.9, -12.42, -12.6, -18.1, -18.2, -14.16, -11.1, -7.09, -15.34, -11.88]
    }],
    chart: {
        type: 'bar',
        height: 400,
        stacked: true,
        toolbar: {
            show: false
        },
    },
    plotOptions: {
        bar: {
            // columnWidth: '20%',
        },
    },
    colors: ["#812082", "#50368c"],
    fill: {
        opacity: 1
    },
    dataLabels: {
        enabled: false,
    },
    legend: {
        show: false,
    },
    yaxis: {
        labels: {
            formatter: function (y) {
                return y.toFixed(0) + "%";
            }
        }
    },
    xaxis: {
        categories:
            ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        ,
        labels: {
            rotate: -90
        }
    }
};

var chart = new ApexCharts(document.querySelector("#market-overview"), options);
chart.render();

// MAp

// var vectormapColors = getChartColorsArray("#sales-by-locations");
// $('#sales-by-locations').vectorMap({
//     map: 'world_mill_en',
//     normalizeFunction: 'polynomial',
//     hoverOpacity: 0.7,
//     hoverColor: false,
//     regionStyle: {
//         initial: {
//             fill: '#e9e9ef'
//         }
//     },
//     markerStyle: {
//         initial: {
//             r: 9,
//             'fill': ["#5156be"],
//             'fill-opacity': 0.9,
//             'stroke': '#fff',
//             'stroke-width': 7,
//             'stroke-opacity': 0.4
//         },

//         hover: {
//             'stroke': '#fff',
//             'fill-opacity': 1,
//             'stroke-width': 1.5
//         }
//     },
//     backgroundColor: 'transparent',
//     markers: [{
//         latLng: [41.90, 12.45],
//         name: 'USA'
//     }, {
//         latLng: [12.05, -61.75],
//         name: 'Russia'
//     }, {
//         latLng: [1.3, 103.8],
//         name: 'Australia'
//     }]
// });