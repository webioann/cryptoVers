import React, { useEffect } from 'react'
import { useAppSelector } from '../Redux/store'
import DOMPurify from 'dompurify'
import { useParams } from 'react-router-dom'
import SocialLink from './SocialLink'
import MarketStats  from './MarketStats'
import CoinDetailsTitle from './CoinDetailsTitle';
import LineChart from './LineChart'
import { useLazyCoinDetailsQuery } from '../Redux/coinsApi'
import { IQueryParams } from '../Types/chartData.types'
import { useLazyFetchChartDataQuery } from '../Redux/chartDataApi'
import { useGetNewsQuery } from '../Redux/newsApi'
import '../CSS/coin-details.scss'

const CoinDetails: React.FC = () => {

    const theme = useAppSelector(state => state.redux.theme_mode)
    const { coinId } = useParams()
    const [ fetchCoinDetailsData, { data }] = useLazyCoinDetailsQuery()
    const period = useAppSelector(state => state.chart.period)
    const currentCurrency = useAppSelector(state => state.chart.currency.currentCurrency)
    const [ fetchChartData, { data: chartData, isLoading } ] = useLazyFetchChartDataQuery()
    const { data: news } = useGetNewsQuery({ newsCategory: coinId, count: 2 })

    useEffect(() => {
        const queryParams:IQueryParams = {
            coinId: coinId,
            currency: currentCurrency,
            period:  period,
        }
        fetchChartData(queryParams)
        console.log(`ChartData`)
    }, [period, currentCurrency])

    console.log(`news ${JSON.stringify(news)}`);

    useEffect(() => {
        coinId !== null && fetchCoinDetailsData(coinId)
        console.log(`CoinDetails`)
    }, [coinId])
    
    if( data ) {
        return (
            <div className='g-page-container'>
                <div className='coin'>
                    <div className='info'>
                        <div className='coin-info'>
                            <CoinDetailsTitle data={data}/>
                            { chartData ? <LineChart chartData={chartData}/> : null }
                            <div className='social-links'>
                                <SocialLink type='homepage' coin={data}/>
                                <SocialLink type='fasebook' coin={data}/>
                                <SocialLink type='reddit' coin={data}/>
                                <SocialLink type='telegram' coin={data}/>
                                <SocialLink type='twitter' coin={data}/>
                            </div>
                        </div>
                        <MarketStats data={data}/>
                    </div>
                    <div className={`discription-${theme}`}>
                        <h2>About {data.name}</h2>
                        <p dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(data.description ? data.description.en : ''),}} ></p>
                    </div>
                </div>
            </div>
        )
    } else { return null }
}

export default CoinDetails;
