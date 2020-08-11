import React, { useState } from 'react'
import { useQuery } from 'react-apollo'

import useProduct from 'vtex.product-context/useProduct'
import { useCssHandles } from 'vtex.css-handles'

import { TimeSplit } from './typings/global'
import { tick } from './utils/time'
import productReleaseDate from './queries/productReleaseDate.graphql'

const DEFAULT_TARGET_DATE = (new Date('2020-08-11')).toISOString()
const CSS_HANDLES = ['countdown']

const Countdown: StorefrontFunctionComponent = () => {
  const handles = useCssHandles(CSS_HANDLES)

  const { product } = useProduct()
  const { data, loading, error } = useQuery(productReleaseDate, {
    ssr: false,
    variables: {
      slug: product.linkText
    }
  })

  const [timeRemaining, setTime] = useState<TimeSplit>({
    hours: '00',
    minutes: '00',
    seconds: '00'
  })

  tick(data?.product?.releaseDate || DEFAULT_TARGET_DATE, setTime)

  if (loading) {
    return <span>Loading...</span>
  }

  if (error) {
    return <span>Erro!</span>
  }

  if (!product) {
    return <span>Não há contexto de produto</span>
  }

  return (
    <div className={`${handles.countdown} t-heading-2 fw3 w-100 c-muted-1 db tc`}>
      {`${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}`}
    </div>
  ) 
}

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {},
}

export default Countdown
