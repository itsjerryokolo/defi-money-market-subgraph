# Defi Money Market Subgraph
Defi Money Market is an open source protocol that allows users earn a stable 6.25% APY on ETH, DAI, USDC, and USDT, backed by real-world assets

## Example Query
```graphql
{
  mDaiMints(first: 5) {
    id
    symbol
    tokenAddress
    minterAddress
  }
}
```
