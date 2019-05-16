import React from 'react'

export default function Svg({ name, size }) {
  const getPath = (name, props) => {
    switch (name) {
      case 'image':
        return (
          <>
            <path
              d='M45.079 24.214L6.609 46.425V2.003zM7.609 44.693l35.47-20.48L7.609 3.737z'
              fill='none'
            />
            <path fill='#fff' d='M0 0h50v50H0z' />
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
            fill='green'
            {...props}
          />
        )
      case 'arrow-next':
        return (
          <g transform='matrix(0.745886, 0, 0, 0.745886, 5.189176, 7.678972)'>
            <path
              d='M -2.605 17.817 L 37.833 17.817 L 10.631 -7.661 L 24.79 -7.515 L 57.537 23.153 L 57.666 23.153 L 57.601 23.212 L 57.751 23.353 L 57.452 23.35 L 24.534 53.79 L 10.373 53.839 L 36.763 29.435 L -2.605 29.435 Z'
              fill='green'
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
