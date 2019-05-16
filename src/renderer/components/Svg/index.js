import React from 'react'

export default function Svg({ name, size }) {
  const getPath = (name, props) => {
    switch (name) {
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
