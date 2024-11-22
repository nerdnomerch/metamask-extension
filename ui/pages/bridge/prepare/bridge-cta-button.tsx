import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../../components/component-library';
import {
  getBridgeQuotes,
  getFromAmount,
  getFromChain,
  getFromToken,
  getRecommendedQuote,
  getToAmount,
  getToChain,
  getToToken,
} from '../../../ducks/bridge/selectors';
import { useI18nContext } from '../../../hooks/useI18nContext';
import useSubmitBridgeTransaction from '../hooks/useSubmitBridgeTransaction';

export const BridgeCTAButton = () => {
  const dispatch = useDispatch();
  const t = useI18nContext();

  const fromToken = useSelector(getFromToken);
  const toToken = useSelector(getToToken);

  const fromChain = useSelector(getFromChain);
  const toChain = useSelector(getToChain);

  const fromAmount = useSelector(getFromAmount);
  const toAmount = useSelector(getToAmount);

  const { isLoading } = useSelector(getBridgeQuotes);
  const quoteResponse = useSelector(getRecommendedQuote);

  const { submitBridgeTransaction } = useSubmitBridgeTransaction();

  const isTxSubmittable =
    fromToken && toToken && fromChain && toChain && fromAmount && toAmount;

  const label = useMemo(() => {
    if (isLoading && !isTxSubmittable) {
      return t('swapFetchingQuotes');
    }

    if (!fromAmount) {
      if (!toToken) {
        return t('bridgeSelectTokenAndAmount');
      }
      return t('bridgeEnterAmount');
    }

    if (isTxSubmittable) {
      return t('confirm');
    }

    return t('swapSelectToken');
  }, [isLoading, fromAmount, toToken, isTxSubmittable]);

  return (
    <Button
      data-testid="bridge-cta-button"
      onClick={() => {
        if (isTxSubmittable) {
          dispatch(submitBridgeTransaction(quoteResponse));
        }
      }}
      disabled={!isTxSubmittable}
    >
      {label}
    </Button>
  );
};
