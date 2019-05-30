import React from 'react'

export default function Svg({ name, ...rest }) {
  const getPath = x => {
    switch (x) {
      case 'arrow-end':
        return (
          <>
            <path
              d='M14.611 7.924l16.983 17.18h.048l-.024.025.024.025h-.048l-16.983 17.18-11.725.009 17.017-17.215L2.886 7.916z'
              fill='#98bdb0'
            />
            <path
              d='M31.997 7.942l16.983 17.18h.048l-.024.025.024.025h-.048l-16.983 17.18-11.725.009 17.017-17.215L20.272 7.934z'
              fill='#98bdb0'
            />
          </>
        )
      case 'arrow-next':
        return (
          <>
            <path
              d='M20.99 7.57l16.983 17.18h.048l-.024.025.024.025h-.048L20.99 41.98l-11.725.009 17.017-17.215L9.265 7.562z'
              fill='#98bdb0'
            />
          </>
        )
      case 'arrow-prev':
        return (
          <>
            <path
              d='M26.296 41.981L9.313 24.801h-.048l.024-.025-.024-.025h.048l16.983-17.18 11.725-.009-17.017 17.215 17.017 17.212z'
              fill='#98bdb0'
            />
          </>
        )
      case 'arrow-start':
        return (
          <>
            <path
              d='M35.531 42.442l-16.983-17.18H18.5l.024-.025-.024-.025h.048l16.983-17.18 11.725-.009-17.017 17.215L47.256 42.45z'
              fill='#98bdb0'
            />
            <path
              d='M18.145 42.424L1.162 25.244h-.048l.024-.025-.024-.025h.048l16.983-17.18 11.725-.009L12.853 25.22 29.87 42.432z'
              fill='#98bdb0'
            />
          </>
        )
      case 'board-new':
        return (
          <>
            <circle fill='#d8d8d8' />
            <path fill='#d8d8d8' d='M44.392 13.349h.079v.079h-.079z' />
            <path stroke='#808080' fill='none' d='M2 7.03h46v36H2z' />
            <path
              d='M11.3582 10.6753l-.1018.2669 3.266 4.0793a8.184 8.184 0 0 1-.5032.5325l-4.2576-3.03-.2606.1168-.5753 5.1938a8.184 8.184 0 0 1-.7322.0208l-.868-5.153-.267-.1018-4.0793 3.2658a8.184 8.184 0 0 1-.5324-.503l3.0299-4.2576-.1167-.2607-5.1939-.5753a8.184 8.184 0 0 1-.0207-.7322l5.153-.868.1018-.267-3.2659-4.0793a8.184 8.184 0 0 1 .5031-.5324L6.895 6.8208l.2607-.1167.5752-5.1939a8.184 8.184 0 0 1 .7322-.0207l.868 5.153.267.1018 4.0793-3.2659a8.184 8.184 0 0 1 .5324.5032L11.18 8.239l.1168.2607 5.1938.5752a8.184 8.184 0 0 1 .0207.7323zm-1.1687-.293a1.992 1.992 0 0 0-3.7224-1.4198 1.992 1.992 0 0 0 3.7224 1.4199'
              fill='#efc380'
            />
            <path
              d='M5.6014 29.15v-1.4531c0-.1677-.0603-.4305 0-.5813.0537-.134.0917-.2854.1938-.3875.0722-.0722.203-.0443.2906-.0969l.3875-.3875c.1691-.2254.208-.5357.3875-.775.1782-.2376.4514-.303.6781-.4843.2052-.1642.4639-.5402.5813-.775.2793-.5587-.1259-.026.2906-.5813.0548-.073.1529-.112.1937-.1937.0837-.1674.1098-.4134.1938-.5813v-.1937c.051-.051.1504-.0391.1937-.0969.0613-.0817.0247-.2184.097-.2906.1784-.1785.2878.0054.3874-.1938.0457-.0913.0402-.2056.0969-.2906.1242-.1863.3602-.298.4844-.4844.08-.1201.107-.272.1937-.3875.0854-.1139.3193-.251.3875-.3875.0457-.0913.0512-.1992.0969-.2906.0768-.1537.2845-.1534.3875-.2906.0698-.0931.1028-.2179.1937-.2906.0798-.0638.2057-.0403.2906-.0969.027-.018-.0193-.071 0-.0969.0822-.1096.1837-.205.2907-.2906.2054-.1644.6529-.484.8718-.5813.1505-.0668.3297-.0406.4844-.0968 2.4582-.894-.5518.1258.8719-.4844.0958-.041.4646-.0771.5812-.1937.1332-.1332.134-.38.2907-.4844.0537-.0358.14.0358.1937 0 .06-.04.0568-.1337.0969-.1938.0993-.1489.28-.2441.3875-.3875.1397-.1863.2056-.4358.3875-.5812.0797-.0638.2056-.0402.2906-.0969.152-.1013.2241-.3058.3875-.3875.1582-.0791.4685-.2184.5812-.3875.0401-.06.0459-.1427.097-.1937.2973-.2974.0805.0566.3874-.097.0817-.0408.1145-.1483.1938-.1937.5396-.3083.368-.1016.8718-.2906.1353-.0507.2505-.148.3875-.1937 1.0558-.352-.0291.0833.872-.097.2074-.0414.3991-.363.5812-.4843.1201-.08.272-.107.3875-.1937.073-.0548.112-.153.1937-.1938.3334-.1667.8139-.238 1.1625-.3875.3813-.1634.6625-.4346 1.0656-.5812.5248-.1908 1.1726-.2472 1.6469-.4844.1155-.0578.2604-.0231.3875 0 .648.1178 1.2946.2446 1.9375.3875.1994.0443.3831.1442.5812.1937.094.0235.2222-.0685.2907 0 .2985.2985-.9746-.228.2906.1938.0504.0168.3452.067.3875.1937.0579.1737 0 .4902 0 .6782 0 .7216-.0176 1.4174-.0969 2.1312-.087.7827.0572 1.5548-.0969 2.325-.0534.267.1051.6266 0 .8719-.3518.8208-1.2238 1.0103-1.8406 1.55-.209.1829-.2735.4973-.4844.678-.143.1226-.3337.1777-.4843.2907-.399.2992-.686.66-1.1625.8719-.4154.1846-.8751.3067-1.2594.5812-.1115.0797-.1766.2147-.2906.2907-.3498.2332-.206-.029-.4844.1937-.107.0856-.1744.218-.2906.2906-.5412.3383-1.0812.0644-1.6469.2907-.1499.06-.243.2184-.3875.2906-.544.272-1.2297.2386-1.7437.5812-.114.076-.1837.205-.2907.2907-.1357.1086-.3614.0707-.4843.1937-.0722.0722-.0331.2109-.0969.2906-.0092.0116-.404.3339-.4844.3875-.0885.059-.235.0827-.2906.1938-.0496.099-.1253.4159-.1937.4843-.0723.0723-.1993.0513-.2907.097-.3954.1976-.7766.4575-1.1625.678-.0886.0507-.2089.0356-.2906.097-.0578.0432-.0458.1426-.0969.1937-.0823.0823-.2179.1028-.2906.1937-.6962.8703.0894.015-.0969.3875-.083.1662-.2247.2868-.2906.4844-.0204.0613.0289.136 0 .1937-.0613.1226-.2201.1732-.2906.2907l-.1938.5812c-.0433.0578-.1504.0391-.1937.0969-.1043.1391-.0973.3397-.1938.4844-.2724.4087.1663-.5263-.2906.3875-.1319.2637-.0777.5042-.1937.775-1.3034 3.0412 1.0158-2.612-.2907.8718-.0408.109-.1617.1787-.1937.2906-.0902.3156-.0055.7457-.0969 1.0657-.046.1607-.1532.3222-.1937.4843-.1574.6295-.2907 1.1-.2907 1.7438v.3875c0 .0646-.0626.178 0 .1937.3133.0784.6459 0 .9688 0H16.742c.2224 0 .5502.045.775 0 .6613-.1322 1.2027-.5009 1.8406-.678.2818-.0784.5901-.0187.8719-.097.3064-.085.5812-.2583.8719-.3875.6832-.3036 1.3213-.558 1.9375-.9687.252-.168.7398-.3524.9687-.5813.1021-.102.0916-.2853.1937-.3875.1142-.1141.2812-.169.3875-.2906.531-.6068-.0034-.427.775-.8719.2762-.1577.5947-.2315.872-.3874.5838-.3285 1.2398-.8115 1.7437-1.2594.1706-.1517.306-.3418.4843-.4844.147-.1176.3358-.175.4844-.2906.4229-.329.7629-.8073 1.1625-1.1625.358-.3182.3914-.2228.6781-.5813.1177-.147.2064-.316.2907-.4843.0913-.1827.0661-.4218.1937-.5813.0727-.0909.2149-.1053.2906-.1937.1226-.143.1862-.3277.2906-.4844.1147-.172.3274-.253.4844-.3875.4054-.3475.1984-.325.775-.5813.1217-.054.2639-.0474.3875-.0968.7642-.3057 1.2837-.8892 1.9375-1.3563.1086-.0776.6991-.4268.8719-.4843.1562-.0521.3339-.03.4844-.097.1475-.0655.2463-.2121.3875-.2905.0615-.0343.5322-.1934.678-.2907.215-.1432.3503-.4657.5813-.5812.0914-.0457.209-.0356.2906-.0969.0578-.0433.0368-.1537.097-.1937.0968-.0646.1937.0323.2905 0 .4109-.137.8136-.097 1.2594-.097.489 0 .9542-.0968 1.4531-.0968.0592 0 .3498-.0377.3875 0 .0229.0228-.0144.068 0 .0969.0521.1041.1417.1865.1938.2906.0433.0867-.0307.1987 0 .2906.0144.0434.0764.056.0969.097.0563.1127 0 .4496 0 .5812 0 .8481.1192 1.7807 0 2.6156-.1096.7668-.097.2338-.097.6781 0 .3758-.0968.6967-.0968 1.0656 0 .3267.0913.3338-.0969.4844-.5517.4414-1.1611.4-1.8406.5812-.1973.0527-.3831.1443-.5812.1938-.1906.0476-.3967.0297-.5813.0969-.177.0643-.3057.231-.4844.2906-.1225.0408-.2637-.0371-.3875 0-.5266.158-.9889.5097-1.453.775-.1297.074-.5924.108-.6782.1937-.051.051-.0458.1427-.0969.1938-.2003.2003-.2586.1188-.3875.2906-.0698.0931-.1028.2179-.1937.2906-.0798.0638-.2184.0247-.2906.0969-.0722.0722-.0247.2184-.097.2906-.0721.0722-.1992.0512-.2905.0969-.3515.1757-.7464.3418-1.0657.5813-.2097.1573-.3211.3853-.4843.5812-.1757.2108-.3169.237-.3875.4844-.1344.4703-.1311.832-.3875 1.2593-.2885.4809-.7078.8788-.8719 1.4532-.0755.2642.1221.7244 0 .9687-.1197.2394-.0969-.0334-.0969.1938 0 .0568-.0257.3789 0 .3875.092.0306.194-.0075.2906 0 .3236.0248.6449.0766.9688.0968.443.0277 1.2055.1238 1.6469-.0968.2206-.1104.388-.3395.5812-.4844.1506-.113.3414-.1681.4844-.2906.0884-.0758.099-.223.1937-.2907.1415-.101.3324-.1093.4844-.1937.1411-.0784.24-.225.3875-.2906.3976-.1768.9345-.097 1.3563-.097 1.0457 0-.4221.0458.2906-.0968.3772-.0754.9847 0 1.3562 0 .1292 0 .2962-.0913.3875 0 .0774.0774 0 .564 0 .6781V38.45'
              stroke='#ec7600'
              fill='none'
            />
          </>
        )
      case 'border':
        return (
          <>
            <path stroke='#333333' strokeWidth='1.5' fill='none' d='M2 2h46v46H2z' />
            <path
              d='M23 1.002l4-.001v6.018l-4 .001zM27.001 21l-4 .001L23 10.02l4-.001zm22 2l.001 4h-7.274v-4zm-20 4.001l-.001-4h9.728v4zm-1.998 22l-4 .001v-6.291l4-.001zm-4.001-20l4-.001.001 10.71-4 .001zm-22-1.998l-.001-4h6.897v4zM21 23.002l.001 4-10.103.001v-4z'
              fill='gray'
            />
            <circle cx='25' cy='25' r='2.5' fill='gray' />
          </>
        )
      case 'camera-new':
        return (
          <>
            <circle fill='#d8d8d8' />
            <path d='M19.237 10h11.53l5.733 5.471h-23z' fill='#808080' />
            <path fill='#d8d8d8' d='M44.392 13.349h.079v.079h-.079z' />
            <path
              d='M2 15.403h46v27.962H2zM25 20c-4.971 0-9 4.029-9 9s4.029 9 9 9 9-4.029 9-9-4.029-9-9-9zM6.082 21.17h4.186v-2.923H6.082z'
              fill='#808080'
            />
            <path
              d='M11.5609 12.5353l-.1018.2668 3.2659 4.0794a8.184 8.184 0 0 1-.5032.5324L9.9643 14.384l-.2607.1168-.5752 5.1938a8.184 8.184 0 0 1-.7323.0207l-.868-5.153-.2669-.1018-4.0793 3.2659a8.184 8.184 0 0 1-.5325-.5031l3.03-4.2576-.1168-.2607-5.1938-.5752a8.184 8.184 0 0 1-.0208-.7322l5.153-.868.1018-.267L2.337 6.1833a8.184 8.184 0 0 1 .503-.5324l4.2576 3.0299.2607-.1168.5753-5.1938a8.184 8.184 0 0 1 .7322-.0207l.868 5.153.267.1018 4.0793-3.266a8.184 8.184 0 0 1 .5324.5032l-3.0299 4.2576.1167.2606 5.1939.5753a8.184 8.184 0 0 1 .0207.7322zm-1.1687-.293a1.992 1.992 0 0 0-3.7224-1.4198 1.992 1.992 0 0 0 3.7224 1.4198'
              fill='#efc380'
            />
            <circle cx='25' cy='29' r='7' fill='#808080' />
          </>
        )
      case 'cancel':
        return (
          <>
            <path
              d='M2.1976 4.396L5.8403.971l19.2691 20.4945L45.604 2.1965l3.4249 3.6427-20.4945 19.269 19.269 20.4946-3.6427 3.425-19.269-20.4946L4.397 47.8023.972 44.1596l20.4946-19.2691z'
              fill='#9d2820'
            />
          </>
        )
      case 'check':
        return (
          <>
            <path
              d='M2.2326 30.1008l3.7139-5.9333L23.072 34.8882l19.2522-30.41 5.914 3.744-23.001 36.3315-5.914-3.744.0037-.0067z'
              fill='#808080'
            />
          </>
        )
      case 'clock-increase':
        return (
          <>
            <circle
              cx='24.881'
              cy='25.039'
              r='21.381'
              stroke='#407eb5'
              strokeWidth='2'
              fill='#fff'
            />
            <path
              stroke='#000'
              strokeWidth='2'
              d='M24.734 8.455v17.319M40.1445 25.112l-15.5563-.2929'
            />
            <path
              d='M8.0572 30.0546h3v6.992l6.992-.0001.0001 3h-6.992v6.992h-3v-6.992l-6.992.0001v-3h6.992z'
              fill='gray'
            />
            <path fill='#d21f1f' d='M31.358 36.493H47.63v3.476H31.358z' />
          </>
        )
      case 'clock-override':
        return (
          <>
            <circle
              cx='24.881'
              cy='25.039'
              r='21.381'
              stroke='#407eb5'
              strokeWidth='2'
              fill='#fff'
            />
            <path
              stroke='#000'
              strokeWidth='2'
              d='M24.734 8.455v17.319M40.1445 25.112l-15.5563-.2929'
            />
            <path
              d='M15.228 39.4651l-.13.3408 4.17 5.2086a10.4497 10.4497 0 0 1-.6424.6799l-5.4362-3.8687-.3329.149-.7344 6.6318a10.4497 10.4497 0 0 1-.935.0264l-1.1084-6.5796-.3407-.13-5.2087 4.1701a10.4497 10.4497 0 0 1-.6798-.6424l3.8686-5.4362-.149-.3329-6.6317-.7344a10.4497 10.4497 0 0 1-.0265-.935l6.5796-1.1084.13-.3408-4.17-5.2086a10.4497 10.4497 0 0 1 .6423-.6799l5.4363 3.8687.3328-.149.7345-6.6318a10.4497 10.4497 0 0 1 .935-.0264l1.1083 6.5796.3408.13 5.2087-4.1701a10.4497 10.4497 0 0 1 .6798.6424l-3.8687 5.4362.149.3329 6.6318.7344a10.4497 10.4497 0 0 1 .0265.935zm-2.5355-.772a1.427 1.427 0 0 0-2.6665-1.017 1.427 1.427 0 0 0 2.6665 1.017'
              fill='#efc380'
            />
          </>
        )
      case 'close':
        return (
          <>
            <path
              d='M3.187 3.4657l1.664-1.5645 20.1993 21.484L46.5342 3.1857l1.5645 1.664-21.484 20.1993 20.1994 21.484-1.664 1.5644-20.1993-21.4839L3.4668 46.813l-1.5645-1.664 21.484-20.1994z'
              fill='#808080'
            />
          </>
        )
      case 'crop':
        return (
          <>
            <g fill='#808080'>
              <path d='M12.7621 11.8892h32.412v4.8148H18.056V44.301h-5.294z' />
              <path d='M36.6636 35.6454l-32.412-.0133.002-4.8148 27.1179.011.0112-27.597 5.294.002z' />
            </g>
          </>
        )
      case 'cursor':
        return (
          <>
            <path
              d='M28.1066 48.9148l-5.9543-16.5781-8.9208 6.6838L14.58 1.2568 39.6474 29.533l-11.1348.5194 5.9542 16.5782-6.3602 2.2843z'
              stroke='#333'
              strokeWidth='1.5'
              fill='#fff'
            />
          </>
        )
      case 'delete':
        return (
          <>
            <path
              strokeWidth='.5'
              fill='none'
              stroke='gray'
              d='M5.611 7.956h33.926v33.926H5.611z'
            />
            <path
              d='M14.136 18.153c1.049-1.286 2.102-1.288 3.155-.004l6.514 7.901-.006.004 12.28 15.149H21.731v-.008l-15.471.033V27.781zm15.47 3.162c1.05-1.285 2.102-1.287 3.158-.007l6.109 7.414v12.481H36.91L25.179 26.729z'
              fill='#407eb5'
            />
            <circle cx='33.463' cy='13.353' r='3.802' fill='#efc380' />
            <path
              d='M22.4446 29.0014l2.7627-2.8927 8.081 7.7178 7.718-8.081 2.8926 2.7627-7.7179 8.081 8.081 7.718-2.7626 2.8926-8.081-7.7179-7.718 8.081-2.8926-2.7626 7.7179-8.081z'
              fill='#df736d'
            />
          </>
        )
      case 'delete-next':
        return (
          <>
            <path
              d='M31.766 11.439L48.237 25.82h.046l-.023.021.023.021h-.046L31.766 40.243l-11.372.008 12.515-10.928H26.94v-6.149h6.904l-13.45-11.742zM3.262 29.323v-6.149h3.22v6.149zm10.802-6.149v6.149H7.351v-6.149zm12.007 0v6.149H14.933v-6.149z'
              fill='#df806d'
            />
          </>
        )
      case 'delete-prev':
        return (
          <>
            <path
              d='M17.488 40.481L1.017 26.1H.971l.023-.021-.023-.021h.046l16.471-14.381 11.372-.008-12.515 10.928h5.969v6.149H15.41l13.45 11.742zm28.504-17.884v6.149h-3.22v-6.149zM35.19 28.746v-6.149h6.713v6.149zm-12.007 0v-6.149h11.138v6.149z'
              fill='#df806d'
            />
          </>
        )
      case 'deselect':
        return (
          <>
            <path
              fill='#fff'
              strokeWidth='1.5'
              stroke='#407eb5'
              d='M2.063 7.264h25.833v25.833H2.063z'
            />
            <path
              fill='#fff'
              strokeWidth='1.5'
              stroke='#407eb5'
              d='M14.554 12.313h25.833v25.833H14.554z'
            />
            <path
              d='M42.108 47.3872l-4.7229-7.9477-3.9291 4.3345-3.0743-19.5907 15.7372 12.0659-5.6846 1.3784 4.7229 7.9476-3.0493 1.812z'
              stroke='#333'
              strokeWidth='1'
              fill='#fff'
            />
          </>
        )
      case 'draw':
        return (
          <>
            <path
              d='M46.57 29.257c0 9.215-10.781 16.685-24.081 16.685-13.299 0-24.08-7.47-24.08-16.685 0-9.214 10.781-16.684 24.08-16.684 13.3 0 24.081 7.47 24.081 16.684z'
              fill='none'
            />
            <path
              d='M48.179 29.257c0 5.044-3.136 9.927-7.746 13.12-4.556 3.158-11.055 5.174-17.944 5.174-6.888 0-13.387-2.016-17.944-5.174C-.064 39.184-3.2 34.301-3.2 29.257c0-5.044 3.136-9.927 7.745-13.12 4.557-3.157 11.056-5.174 17.944-5.174 6.889 0 13.388 2.017 17.944 5.174 4.61 3.193 7.746 8.076 7.746 13.12zM38.6 18.782c-4.159-2.881-9.7-4.6-16.111-4.6-6.41 0-11.951 1.719-16.11 4.6-4.106 2.845-6.36 6.305-6.36 10.475 0 4.171 2.254 7.63 6.36 10.475 4.159 2.881 9.7 4.6 16.11 4.6 6.411 0 11.952-1.719 16.111-4.6 4.106-2.845 6.36-6.304 6.36-10.475 0-4.17-2.254-7.63-6.36-10.475z'
              fill='none'
            />
            <path
              d='M47.077 27.477c0 5.044-3.136 9.927-7.746 13.12-4.556 3.158-11.055 5.174-17.944 5.174-5.858 0-11.435-1.458-15.775-3.837V38.18c4.119 2.743 9.535 4.372 15.775 4.372 6.411 0 11.952-1.719 16.111-4.6 4.106-2.845 6.36-6.304 6.36-10.475 0-4.17-2.254-7.63-6.36-10.475-4.159-2.881-9.7-4.6-16.111-4.6-6.24 0-11.656 1.629-15.775 4.373V13.02c4.34-2.378 9.917-3.837 15.775-3.837 6.889 0 13.388 2.016 17.944 5.174 4.61 3.193 7.746 8.076 7.746 13.12z'
              fill='#da5555'
            />
            <path
              d='M46.734 27.175c0 9.82-11.563 17.783-25.826 17.783-14.264 0-25.826-7.963-25.826-17.783 0-9.822 11.562-17.783 25.826-17.783 14.263 0 25.826 7.961 25.826 17.783z'
              fill='none'
            />
            <path
              d='M35.815 1.324l4.264 3.336c.499.392.587 1.114.197 1.614L24.228 26.782c-.053.068-.112.127-.175.179l-.574.734-6.074-4.753 5.892-7.53.022.016L34.202 1.52c.391-.5 1.113-.588 1.613-.196z'
              fill='gray'
            />
            <rect
              x='15.34'
              y='1.456'
              width='7.712'
              height='5.968'
              transform='rotate(38.0437 -38.6945 6.6343)'
              rx='1.677'
              ry='1.677'
              fill='#da5555'
            />
            <path
              d='M16.599 23.881l1.713 1.341c.246.102.482.238.702.41l1.365 1.067c.22.172.409.368.566.583l1.728 1.352-5.091 6.505-.007-.005-2.086 2.665c-1.017 1.3-2.895 1.529-4.196.512l-1.365-1.069c-1.3-1.017-1.53-2.896-.512-4.196l5.402-6.902c.046-.061.095-.117.145-.172z'
              fill='#da5555'
            />
          </>
        )
      case 'editor':
        return (
          <>
            <path stroke='gray' fill='#fff' d='M2.052 2.238h45.71v45.71H2.052z' />
            <path fill='gray' d='M2.052 2.238h45.71v6.399H2.052z' />
            <path
              strokeWidth='.5'
              stroke='gray'
              fill='#fff'
              d='M11.157 15.264H39.08v27.923H11.157z'
            />
            <path
              d='M18.174 23.657c.863-1.059 1.729-1.06 2.596-.004l5.361 6.503-.004.003 10.106 12.47H24.424v-.007l-12.733.027V31.581zm12.732 2.602c.864-1.057 1.73-1.058 2.6-.005l5.027 6.101v10.274h-1.615l-9.656-11.913z'
              fill='#bdd0e5'
            />
            <circle cx='34.081' cy='19.706' r='3.13' fill='#f9ebd2' />
          </>
        )
      case 'eraser':
        return (
          <>
            <path
              d='M34.491 1.277L46.858 12.32c1.547 1.382 1.681 3.756.299 5.303L25.352 42.041 7.651 25.693 29.188 1.576c1.381-1.547 3.756-1.681 5.303-.299zM20.439 47.543c-1.381 1.548-3.756 1.682-5.303.3L2.769 36.8c-1.547-1.382-1.681-3.756-.3-5.304l3.941-4.413 17.701 16.348z'
              fill='#fba7b1'
            />
          </>
        )
      case 'folder':
        return (
          <>
            <path
              stroke='#ebbe7a'
              fill='#ffffff'
              strokeWidth='1.5'
              d='M2.939 41.361L2.58 11.165h27.19l3.141-4.443h12.294l-.27 34.639z'
            />
            <path fill='#ebbe7a' d='M6.5208 15.3052h42.747l-3.9585 26.056H2.5623z' />
          </>
        )
      case 'image':
        return (
          <>
            <path
              strokeWidth='.75'
              fill='#ffffff'
              stroke='#333333'
              d='M3.321 3.217h43.405v43.405H3.321z'
            />
            <path
              d='M14.228 16.264c1.342-1.646 2.689-1.648 4.036-.006l8.334 10.108-.007.005 15.71 19.383H23.944v-.011l-19.793.043V28.581zm19.792 4.045c1.343-1.644 2.689-1.646 4.041-.009l7.815 9.485v15.969h-2.511L28.356 27.236z'
              fill='#407eb5'
            />
            <circle cx='38.955' cy='10.122' r='4.865' fill='#efc380' />
          </>
        )
      case 'info':
        return (
          <>
            <circle cx='24.961' cy='24.882' r='21.879' fill='#407eb5' />
            <path
              d='M20.272 36.967v-2.99l2.41-.51v-11.47l-2.66-.51v-3.01h7.65v14.99l2.4.51v2.99h-9.8zm7.4-26.66v3.74h-4.99v-3.74h4.99z'
              fill='#fff'
            />
            <path
              d='M19.772 33.572l2.41-.51V22.41l-2.66-.51v-3.923h8.65v15.085l2.4.51v3.895h-10.8zm9.8 2.895v-2.085l-2.4-.51V18.977h-6.65v2.097l2.66.51v12.288l-2.41.51v2.085zm-1.4-21.92h-5.99v-4.74h5.99zm-4.99-3.74v2.74h3.99v-2.74z'
              fill='none'
            />
          </>
        )
      case 'insert':
        return (
          <>
            <path d='M21 3.357h8V21h17.643v8H29v17.643h-8V29H3.357v-8H21z' fill='#98bdb0' />
          </>
        )
      case 'inverse':
        return (
          <>
            <path
              strokeWidth='1.5'
              stroke='#407eb5'
              fill='#d3d3d3'
              d='M2.063 7.264h25.833v25.833H2.063z'
            />
            <path
              strokeWidth='1.5'
              fill='#fff'
              stroke='#407eb5'
              d='M14.554 12.313h25.833v25.833H14.554z'
            />
            <path
              d='M42.108 47.3872l-4.7229-7.9477-3.9291 4.3345-3.0743-19.5907 15.7372 12.0659-5.6846 1.3784 4.7229 7.9476-3.0493 1.812z'
              stroke='#333'
              strokeWidth='1'
              fill='#fff'
            />
          </>
        )
      case 'move-left':
        return (
          <>
            <path
              d='M17.9072 38.2816L.51 23.0006H.461l.025-.022-.025-.022H.51L17.998 7.7797l12.042.0277-13.1277 11.3933 31.311.0017-.0004 6.776-32.204-.0018v-.127l-.276-.001 14.2064 12.4778z'
              fill='#407eb5'
            />
          </>
        )
      case 'move-right':
        return (
          <>
            <path
              d='M79.0508.8358l14.3102 12.457.04-.0002-.02.018.0202.018-.04.0001-14.273 12.5002-9.867.0206 10.7147-9.3834-25.6547.1133-.0246-5.551 26.3868-.1165.0004.104h.226L69.1838.8444zM31.882 7.824L49.28 23.1041h.049l-.025.022.025.022h-.049l-17.487 15.178-12.042-.0271 13.127-11.394H1.567v-6.776h32.204v.127l.276.001L19.84 7.78z'
              fill='#98bdb0'
            />
          </>
        )
      case 'obfuscate':
        return (
          <>
            <path fill='gray' d='M0 0h16.7v16.7H0z' />
            <path fill='#fff' d='M0 16.7h16.7v16.7H0z' />
            <path fill='gray' d='M0 33.4h16.7v16.7H0z' />
            <path fill='#fff' d='M16.7 0h16.7v16.7H16.7z' />
            <path fill='gray' d='M16.7 16.7h16.7v16.7H16.7z' />
            <path fill='#fff' d='M16.7 33.4h16.7v16.7H16.7z' />
            <path fill='gray' d='M33.4 0h16.7v16.7H33.4z' />
            <path fill='#fff' d='M33.4 16.7h16.7v16.7H33.4z' />
            <path fill='gray' d='M33.4 33.4h16.7v16.7H33.4z' />
            <path fill='none' stroke='gray' strokeWidth='2' d='M1 1h48.079v48.158H1z' />
          </>
        )
      case 'pause':
        return <path fill='#407eb5' d='M5 2h15v46H5zM30 1.804h15v46H30z' />
      case 'pen':
        return (
          <>
            <path
              fill='#407eb5'
              d='M32.5901 10.3l7.6618 6.6359-22.1042 25.5214-7.6618-6.636zM48.493 7.699l-6.269 7.237-7.812-6.767 1.95-2.252c.063-.117.14-.228.232-.333l3.823-4.414C41.09.391 42.27.306 43.049.981l4.992 4.324c.689.596.835 1.586.395 2.345z'
            />
            <path
              d='M7.8512 38.0715q.1653-.8925.8558-.3034l8.2071 7.0056q.6905.5892-.1653.8926l-10.17 3.6048q-.8558.3034-.6905-.5891z'
              fill='#407eb5'
            />
          </>
        )
      case 'play':
        return <path d='M10.6196 4.9816L44.89 24.5833 10.7795 44.4615l-.16-39.48z' fill='#98bdb0' />
      case 'progress':
        return (
          <>
            <path stroke='gray' fill='#fff' d='M1 2.342h48v18H1zM1 28.506h48v18H1z' />
            <path fill='#407eb5' d='M.5 1.842h36.145v19H.5z' />
            <path fill='#98bdb0' d='M.5 27.983h23.122v19H.5z' />
          </>
        )
      case 'recent':
        return (
          <>
            <path d='M7 3h25.227L43 13.773V48H7z' stroke='gray' fill='#fff' />
            <path d='M31.824 3.819l10.499 10.499H31.824V3.819z' stroke='gray' fill='#fff' />
            <path
              d='M2.686 33.185h15.087v5.833H2.686zm44.629 0v5.833H33.333v-5.833zm-28.91 5.833v-5.833h14.296v5.833z'
              fill='gray'
            />
            <path fill='gray' d='M18.404 30.889h14.297v10.659H18.404z' />
            <path fill='snow' d='M19.622 39.12h11.895v1.024H19.622z' />
            <path fill='#fffefe' d='M30.79 32.331h.722v7.555h-.722z' />
          </>
        )
      case 'record':
        return <circle cx='25' cy='25' r='23' fill='#9d2820' />
      case 'record-new':
        return (
          <>
            <circle cx='25' cy='27' r='20' fill='#9d2820' />
            <path
              d='M13.7726 10.7975l-.1018.2669 3.2659 4.0793a8.184 8.184 0 0 1-.5032.5325l-4.2575-3.03-.2607.1168-.5752 5.1938a8.184 8.184 0 0 1-.7323.0208l-.868-5.153-.2669-.1018-4.0793 3.2658a8.184 8.184 0 0 1-.5325-.503l3.03-4.2576-.1168-.2607-5.1938-.5753a8.184 8.184 0 0 1-.0208-.7322l5.153-.868.1018-.267-3.2658-4.0793a8.184 8.184 0 0 1 .503-.5324l4.2576 3.03.2607-.1168.5752-5.1939a8.184 8.184 0 0 1 .7323-.0207l.868 5.153.267.1018 4.0793-3.2659a8.184 8.184 0 0 1 .5324.5032l-3.03 4.2575.1168.2607 5.1939.5752a8.184 8.184 0 0 1 .0207.7323zm-1.1687-.293a1.992 1.992 0 0 0-3.7225-1.4198 1.992 1.992 0 0 0 3.7225 1.4199'
              fill='#efc380'
            />
          </>
        )
      case 'rectangle':
        return (
          <>
            <path fill='#fff' stroke='#000' strokeWidth='2' d='M1.5 9.163h47v35h-47z' />
          </>
        )
      case 'refresh':
        return (
          <>
            <path
              d='M43 25a18 18 0 0 1-18 18A18 18 0 0 1 7 25 18 18 0 0 1 25 7a18 18 0 0 1 18 18z'
              fill='none'
            />
            <path
              d='M45.5 25c0 2.272-.418 4.537-1.161 6.665l-4.06-3.901c.147-.881.221-1.802.221-2.764 0-4.46-1.598-8.018-4.54-10.96S29.46 9.5 25 9.5c-1.187 0-2.311.113-3.376.335l-4.049-3.892C19.919 5.024 22.456 4.5 25 4.5c5.481 0 10.923 2.432 14.496 6.004C43.068 14.077 45.5 19.519 45.5 25zM25 45.5c-5.481 0-10.923-2.432-14.496-6.004C6.932 35.923 4.5 30.481 4.5 25c0-2.922.691-5.833 1.878-8.456l3.823 3.675C9.738 21.689 9.5 23.277 9.5 25c0 4.46 1.598 8.018 4.54 10.96S20.54 40.5 25 40.5c1.954 0 3.736-.307 5.368-.899l3.821 3.672C31.382 44.672 28.198 45.5 25 45.5z'
              fill='#407eb5'
            />
            <path
              d='M30.0697 39.9496l2.9391-3.6124-5.2962-2.4334 13.5826-3.5617-.724 14.0237-3.4605-4.6912-2.9391 3.6124-4.1019-3.3374z'
              fill='#407eb5'
            />
            <path
              d='M21.6826 9.8015l-3.1418 3.0274 4.8465 2.9428-13.8742 1.8581 2.3718-13.795 2.7612 4.9522 3.1417-3.0274 3.8948 4.0419z'
              fill='#407eb5'
            />
          </>
        )
      case 'reverse':
        return (
          <>
            <path
              d='M34.3428 1.7838l14.3102 12.457.04-.0002-.02.018.0202.018-.04.0001-14.273 12.5002-9.867.0206 10.7147-9.3834-25.6548.1133-.0245-5.551 26.3868-.1165.0004.104h.226L24.4758 1.7924z'
              fill='#98bdb0'
            />
            <path
              d='M15.4338 48.3196L1.0773 35.916l-.04.0003.0199-.0181-.0202-.0179.04-.0003 14.2262-12.5523 9.8669-.0584-10.6796 9.4233 25.6541-.209.0453 5.5518-26.3861.215-.0009-.104-.226.0008 11.724 10.1279z'
              fill='#407eb5'
            />
          </>
        )
      case 'save':
        return (
          <>
            <path
              d='M17.654 37.042h2.825c.216 0 .39.19.39.425v9.546h14.585c.808 0 1.462-.714 1.462-1.595v-8.823c0-.881-.654-1.595-1.462-1.595H15.462c-.807 0-1.462.714-1.462 1.595v8.823c0 .881.655 1.595 1.462 1.595h1.802v-9.546c0-.235.174-.425.39-.425zM3 1h44v47.414H7.457L3 43.552V1zm3.666 25H42V5H8v21z'
              fill='#b091c0'
            />
          </>
        )
      case 'scale':
        return (
          <>
            <path strokeWidth='.5' fill='none' stroke='#808080' d='M12.799 12.775h25v25h-25z' />
            <path
              d='M19.081 20.289c.773-.948 1.549-.949 2.325-.003l4.8 5.822-.004.003 9.049 11.164H24.678v-.006l-11.401.024v-9.909zm11.4 2.33c.774-.947 1.549-.948 2.327-.005l4.502 5.463v9.198h-1.447l-8.644-10.666z'
              fill='#407eb5'
            />
            <path
              d='M5.8492 2.1302l3.3763 3.3765L11.54 2.1813l.7153 10.1145L2.14 11.5806l3.3256-2.3143-3.3763-3.3765 3.7598-3.7596z'
              fill='#407eb5'
            />
            <circle cx='33.323' cy='16.752' r='2.802' fill='#efc380' />
            <path
              d='M48.4449 5.8699l-3.3763 3.3766 3.2634 2.252-10.0112.8193.8184-10.0113 2.2523 3.2632 3.3762-3.3766 3.6772 3.6768z'
              fill='#407eb5'
            />
            <path
              d='M2.1811 44.812l3.317-3.4347-3.3653-2.256L12.234 38.23l-.5392 10.1254-2.372-3.2847-3.317 3.4348-3.8247-3.6935zM44.8 48.5557l-3.3764-3.3764-2.3143 3.3255-.715-10.1152 10.1146.7156-3.3256 2.3144 3.3765 3.3764L44.8 48.5557z'
              fill='#407eb5'
            />
          </>
        )
      case 'screen':
        return (
          <>
            <path fill='none' stroke='#407eb5' strokeWidth='3' d='M1.872 8.455h46v26h-46z' />
            <path d='M22.498 34.734h5.103v4.325h4.338v2.473H17.906v-2.473h4.592z' fill='#407eb5' />
          </>
        )
      case 'search':
        return (
          <>
            <path
              d='M35.73 19.771c-.345 3.74-1.851 6.953-4.069 9.434L45.88 45.116l-4.03 3.602-14.41-16.124c-5.234 2.95-12.023 3.074-17.626-.891C5.01 28.304 2.384 22.6 2.925 16.74 4.092 4.113 18.49-2.516 28.842 4.809c4.804 3.398 7.43 9.102 6.888 14.962zM14.927 8.695c-7.36 3.389-8.292 13.474-1.678 18.152 3.069 2.172 7.065 2.541 10.48.969 7.359-3.389 8.291-13.472 1.677-18.152-3.07-2.172-7.064-2.54-10.479-.969z'
              fill='gray'
            />
          </>
        )
      case 'select':
        return (
          <>
            <path
              fill='#fff'
              stroke='#000'
              strokeWidth='2'
              strokeDasharray='2'
              d='M1.5 9.163h47v35h-47z'
            />
          </>
        )
      case 'settings':
        return (
          <>
            <path
              d='M28.3205 35.111l-.968 2.3854 2.4847 4.099a15.2927 15.2927 0 0 1-2.5236 2.5603l-4.1344-2.4255-2.3711 1.0022-1.1415 4.6555a15.2927 15.2927 0 0 1-3.5949.0258l-1.2084-4.6385-2.3853-.968-4.099 2.4848a15.2927 15.2927 0 0 1-2.5603-2.5236l2.4255-4.1345-1.0022-2.371-4.6556-1.1416a15.2927 15.2927 0 0 1-.0258-3.5948l4.6386-1.2084.968-2.3853-2.4848-4.099a15.2927 15.2927 0 0 1 2.5236-2.5604l4.1344 2.4255 2.3711-1.0022 1.1415-4.6555a15.2927 15.2927 0 0 1 3.5949-.0258l1.2084 4.6385 2.3853.968 4.099-2.4848a15.2927 15.2927 0 0 1 2.5603 2.5236l-2.4255 4.1345 1.0022 2.3711 4.6556 1.1415a15.2927 15.2927 0 0 1 .0258 3.5949zm-5.8373-.9797a5.0975 5.0975 0 0 0-9.4468-3.8335 5.0975 5.0975 0 0 0 9.4468 3.8335M41.865 13.4854l-.6726 1.6573 1.7263 2.848a10.625 10.625 0 0 1-1.7533 1.7788l-2.8726-1.6853-1.6474.6963-.7931 3.2346a10.625 10.625 0 0 1-2.4977.0179l-.8395-3.2228-1.6573-.6725-2.848 1.7263a10.625 10.625 0 0 1-1.7787-1.7534l1.6852-2.8725-.6963-1.6474-3.2346-.7931a10.625 10.625 0 0 1-.0179-2.4977l3.2228-.8395.6725-1.6573-1.7263-2.848A10.625 10.625 0 0 1 27.89 3.1764l2.8725 1.6853 1.6474-.6963.7931-3.2346a10.625 10.625 0 0 1 2.4977-.0179l.8395 3.2228 1.6573.6725 2.848-1.7263a10.625 10.625 0 0 1 1.7788 1.7534L41.139 7.7077l.6962 1.6474 3.2346.7931a10.625 10.625 0 0 1 .018 2.4977zm-4.0556-.6807a3.5417 3.5417 0 0 0-6.5635-2.6636 3.5417 3.5417 0 0 0 6.5635 2.6636'
              fill='#989898'
            />
          </>
        )
      case 'shape':
        return (
          <>
            <ellipse
              cx='24.882'
              cy='25.355'
              rx='23.539'
              ry='17.457'
              stroke='#333'
              strokeWidth='2'
              fill='#fff'
            />
          </>
        )
      case 'stop':
        return <path fill='#407eb5' d='M2 2h46v46H2z' />
      case 'title-frame':
        return (
          <>
            <path fill='#fff' d='M1.422 7.583h47.077v33.175H1.422z' />
            <path
              d='M48.999 7.083v34.175H.922V7.083zM1.922 40.258h46.077V8.083H1.922z'
              fill='#333'
            />
            <path
              d='M25.916 14.294v2.89h-6.43v17.73h-3.55v-17.73h-6.37v-2.89h16.35zm14.591 9.02v2.86h-8.3v8.74h-3.58v-20.62h13.09v2.89h-9.51v6.13h8.3z'
              fill='#333'
              whitespace='pre'
            />
          </>
        )
      case 'watermark':
        return (
          <>
            <path d='M7 3h25.227L43 13.773V48H7z' stroke='gray' fill='#fff' />
            <path d='M31.824 3.819l10.499 10.499H31.824V3.819z' stroke='gray' fill='#fff' />
            <path
              strokeWidth='.5'
              fill='#fff'
              stroke='#c6c6c6'
              d='M14.316 19.135h21.999v21.999H14.316z'
            />
            <path
              d='M19.844 25.747c.681-.834 1.363-.835 2.046-.003l4.224 5.123-.004.003 7.963 9.824h-9.304v-.006l-10.032.022v-8.72zm10.032 2.05c.68-.833 1.363-.834 2.048-.004l3.961 4.807v8.094h-1.273l-7.607-9.386z'
              fill='#bdd0e5'
            />
            <circle cx='32.377' cy='22.634' r='2.466' fill='#f9ebd2' />
          </>
        )
      case 'window-close':
        return (
          <>
            <path
              d='M3.187 3.4657l1.664-1.5645 20.1993 21.484L46.5342 3.1857l1.5645 1.664-21.484 20.1993 20.1994 21.484-1.664 1.5644-20.1993-21.4839L3.4668 46.813l-1.5645-1.664 21.484-20.1994z'
              fill='#FFFFFF'
            />
          </>
        )
      case 'yoyo':
        return (
          <>
            <path
              d='M15.8216 42.4378L1.085 31.394l-.042.0002.023-.015-.0231-.016.042-.0002 14.7225-11.0873 10.168-.021-11.0506 8.3226 26.4408-.1065.0198 4.923-27.1948.1095-.0004-.092h-.234l12.0355 9.0165z'
              fill='#98bdb0'
            />
            <path
              d='M6.201 7.504h40.248v.043h.15l.037 25.835-5.261.007-.031-20.624H6.201z'
              fill='#407eb5'
            />
          </>
        )
      case 'zoom-100':
        return (
          <>
            <path
              d='M22.9886 14.7185l-.0002-4.775-3.988.7152 6.6466-7.6584 6.6464 7.6577-3.988-.7148.0002 4.775-5.317.0003z'
              fill='#407eb5'
            />
            <path
              d='M35.0005 22.9l4.775.0003-.7148-3.9 7.6577 6.5003-7.6584 6.4996.7152-3.9-4.775-.0002.0003-5.2z'
              fill='#407eb5'
            />
            <path
              d='M14.7181 28.305h-4.775l.715 3.988-7.658-6.6468L10.658 19l-.715 3.988 4.775-.0001.0001 5.317zM28.305 35.0002l.0002 4.775 3.988-.7152-6.6467 7.6583-6.6463-7.6577 3.988.7148-.0002-4.775 5.317-.0002z'
              fill='#407eb5'
            />
            <path stroke='#333333' strokeWidth='1.5' fill='none' d='M2 2h46v46H2z' />
          </>
        )
      case 'zoom-fit':
        return (
          <>
            <path strokeWidth='.5' stroke='gray' fill='#fff' d='M9.23 9.952h32.172v32.172H9.23z' />
            <path
              d='M17.313 19.623c.996-1.22 1.994-1.222 2.993-.005l6.176 7.492-.004.004L38.121 41.48H24.516v-.008l-14.67.032V28.752zm14.672 2.998c.995-1.219 1.991-1.219 2.994-.007l5.793 7.031V41.48H38.91L27.785 27.755z'
              fill='#407eb5'
            />
            <circle cx='35.642' cy='15.07' r='3.606' fill='#efc380' />
            <path
              fill='none'
              strokeDashoffset='18'
              stroke='gray'
              strokeDasharray='2'
              d='M2.924 7.267h44.47v37.679H2.924z'
            />
          </>
        )
    }
  }

  return (
    <svg viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg' {...rest}>
      {getPath(name)}
    </svg>
  )
}
