import { ChainId, Percent, Token } from '@uniswap/sdk-core'
import { FeeAmount, TICK_SPACINGS } from './constants'
import { Pool } from './entities/pool'
import { Position } from './entities/position'
import { NonfungiblePositionManager } from './nonfungiblePositionManager'
import { encodeSqrtRatioX96 } from './utils/encodeSqrtRatioX96'

const ADDRESS_THREE = '0x0000000000000000000000000000000000000003'
describe('NonfungiblePositionManager', () => {
  const token0 = new Token(ChainId.MAINNET, '0x0000000000000000000000000000000000000001', 18, 't0', 'token0')
  const token1 = new Token(ChainId.MAINNET, '0x0000000000000000000000000000000000000002', 18, 't1', 'token1')

  const pool_0_1 = new Pool(token0, token1, FeeAmount.MEDIUM, encodeSqrtRatioX96(1, 1), 0, 0, [])

  describe('#mintCallParameters', () => {
    it('throws if liquidity is 0', () => {
      expect(() =>
        NonfungiblePositionManager.mintCallParameters(
          Position.fromAmounts({
            pool: pool_0_1,
            tickLower: -TICK_SPACINGS[FeeAmount.MEDIUM],
            tickUpper: TICK_SPACINGS[FeeAmount.MEDIUM],
            amount0: 0,
            amount1: 0
          }),
          { recipient: ADDRESS_THREE, slippageTolerance: new Percent(1), useEther: false, deadline: 100 }
        )
      ).toThrow('LIQUIDITY')
    })

    it('succeeds in simple case', () => {
      const callInfo = NonfungiblePositionManager.mintCallParameters(
        Position.fromAmounts({
          pool: pool_0_1,
          tickLower: -TICK_SPACINGS[FeeAmount.MEDIUM],
          tickUpper: TICK_SPACINGS[FeeAmount.MEDIUM],
          amount0: 100,
          amount1: 100
        }),
        { recipient: ADDRESS_THREE, slippageTolerance: new Percent(1), useEther: false, deadline: 100 }
      )

      expect(callInfo.calldata).toEqual(
        '0x88316456000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000bb8ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc4000000000000000000000000000000000000000000000000000000000000003c000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000064'
      )
    })
  })
})
