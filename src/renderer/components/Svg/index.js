import React from 'react'

export default function Svg({ name, size }) {
  const getPath = (name, props) => {
    switch (name) {
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
      case 'stop':
        return <path fill='#407eb5' d='M2 2h46v46H2z' />
      case 'pause':
        return <path fill='#407eb5' d='M5 2h15v46H5zM30 1.804h15v46H30z' />
      case 'settings':
        return (
          <>
            <path
              d='M28.3205 35.111l-.968 2.3854 2.4847 4.099a15.2927 15.2927 0 0 1-2.5236 2.5603l-4.1344-2.4255-2.3711 1.0022-1.1415 4.6555a15.2927 15.2927 0 0 1-3.5949.0258l-1.2084-4.6385-2.3853-.968-4.099 2.4848a15.2927 15.2927 0 0 1-2.5603-2.5236l2.4255-4.1345-1.0022-2.371-4.6556-1.1416a15.2927 15.2927 0 0 1-.0258-3.5948l4.6386-1.2084.968-2.3853-2.4848-4.099a15.2927 15.2927 0 0 1 2.5236-2.5604l4.1344 2.4255 2.3711-1.0022 1.1415-4.6555a15.2927 15.2927 0 0 1 3.5949-.0258l1.2084 4.6385 2.3853.968 4.099-2.4848a15.2927 15.2927 0 0 1 2.5603 2.5236l-2.4255 4.1345 1.0022 2.3711 4.6556 1.1415a15.2927 15.2927 0 0 1 .0258 3.5949zm-5.8373-.9797a5.0975 5.0975 0 0 0-9.4468-3.8335 5.0975 5.0975 0 0 0 9.4468 3.8335M41.865 13.4854l-.6726 1.6573 1.7263 2.848a10.625 10.625 0 0 1-1.7533 1.7788l-2.8726-1.6853-1.6474.6963-.7931 3.2346a10.625 10.625 0 0 1-2.4977.0179l-.8395-3.2228-1.6573-.6725-2.848 1.7263a10.625 10.625 0 0 1-1.7787-1.7534l1.6852-2.8725-.6963-1.6474-3.2346-.7931a10.625 10.625 0 0 1-.0179-2.4977l3.2228-.8395.6725-1.6573-1.7263-2.848A10.625 10.625 0 0 1 27.89 3.1764l2.8725 1.6853 1.6474-.6963.7931-3.2346a10.625 10.625 0 0 1 2.4977-.0179l.8395 3.2228 1.6573.6725 2.848-1.7263a10.625 10.625 0 0 1 1.7788 1.7534L41.139 7.7077l.6962 1.6474 3.2346.7931a10.625 10.625 0 0 1 .018 2.4977zm-4.0556-.6807a3.5417 3.5417 0 0 0-6.5635-2.6636 3.5417 3.5417 0 0 0 6.5635 2.6636'
              fill='#989898'
            />
          </>
        )
      case 'image':
        return (
          <>
            <path
              d='M45.079 24.214L6.609 46.425V2.003zM7.609 44.693l35.47-20.48L7.609 3.737z'
              fill='none'
            />
            <path fill='#ffffff' d='M0 0h50v50H0z' />
            <path
              d='M40.24 31.27c.976-1.118 1.954-1.119 2.932-.003l41.534 47.406c.978 1.116.491 1.675-1.463 1.677l-82.966.091c-1.954.002-2.443-.556-1.467-1.675L35.599 36.59 51.02 51.204l1.011-.192L36.149 35.96z'
              fill='#8a9bda'
            />
            <path
              d='M16.162 20.788q1.35-1.323 2.743-.003L69.668 68.89q1.393 1.32-1.35 1.323l-100.023.109q-2.743.003-1.393-1.32z'
              fill='#8a9bda'
            />
            <circle cx='38.886' cy='8.781' r='4.975' fill='#fff8ad' />
            <path stroke='#a9a9a9' fill='none' d='M0 0h49.5v50H0z' />
          </>
        )
      case 'play':
        return (
          <path
            d='M 7.97 3.227 L 8.066 44.902 L 45.079 24.228 L 7.97 3.227 Z'
            fill='#00FF00'
            {...props}
          />
        )
      case 'arrow-next':
        return (
          <g transform='matrix(0.745886, 0, 0, 0.745886, 5.189176, 7.678972)'>
            <path
              d='M -2.605 17.817 L 37.833 17.817 L 10.631 -7.661 L 24.79 -7.515 L 57.537 23.153 L 57.666 23.153 L 57.601 23.212 L 57.751 23.353 L 57.452 23.35 L 24.534 53.79 L 10.373 53.839 L 36.763 29.435 L -2.605 29.435 Z'
              fill='#00FF00'
              {...props}
            />
          </g>
        )
      case 'delete-next':
        return (
          <path
            d='M 2.461 22.887 L 5.426 22.879 L 5.426 27.389 L 2.472 27.397 L 2.461 22.887 Z M 13.04 22.86 L 13.04 27.37 L 6.801 27.386 L 6.801 22.875 L 13.04 22.86 Z M 24.031 22.831 L 24.031 27.342 L 14.414 27.366 L 14.414 22.856 L 24.031 22.831 Z M 37.162 22.053 L 35.181 14.707 L 47.214 25.028 L 36.335 36.052 L 37.545 27.955 L 25.405 27.339 L 25.405 22.829 L 37.162 22.053 Z'
            fill='rgb(255, 92, 92)'
            {...props}
          />
        )
    }
  }

  return (
    <svg width={size} height={size} viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'>
      {getPath(name)}
    </svg>
  )
}
