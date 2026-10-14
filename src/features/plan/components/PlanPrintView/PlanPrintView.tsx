'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';

import { AppButton, AppToast } from '@/base/components/ui';
import { formatCurrency } from '@/base/utils';
import useTripPlan from '../../hooks/useTripPlan';
import styles from './PlanPrintView.module.css';

interface PlanPrintViewProps {
  tripId: string;
}

const PlanPrintView = ({ tripId }: PlanPrintViewProps) => {
  const t = useTranslations('plan.print');
  const [isPreparing, setIsPreparing] = useState(false);
  const [printError, setPrintError] = useState(false);

  const { plan, error, refetch } = useTripPlan({
    tripId,
    includeActivities: true,
  });

  const handlePrint = async () => {
    setIsPreparing(true);

    try {
      await document.fonts.ready;
      window.print();
    } catch {
      setPrintError(true);
    } finally {
      setIsPreparing(false);
    }
  };

  if (error) {
    return (
      <div className={styles.page}>
        <p role="alert">{t('loadError')}</p>

        <AppButton
          intent="secondary"
          onClick={() => void refetch().catch(() => undefined)}
        >
          {t('retry')}
        </AppButton>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className={styles.page}>
        <p role="status">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <AppButton
          intent="primary"
          disabled={isPreparing}
          onClick={() => void handlePrint()}
          startIcon={<PictureAsPdfRoundedIcon />}
        >
          {t('button')}
        </AppButton>
      </div>

      <article>
        <header>
          <h1>{plan.tripName}</h1>
          <p>{plan.destination}</p>

          <p>
            {t('estimatedCost')}:{' '}
            {formatCurrency(plan.totalEstimatedCost, plan.baseCurrency)}
          </p>
        </header>

        {plan.days.map((day) => (
          <section key={day.id} className={styles.day}>
            <h2>
              {t('day', { number: day.dayNumber })}
              {day.title ? ` — ${day.title}` : ''}
            </h2>

            {day.planDate && <p>{day.planDate}</p>}
            {day.note && <p className={styles.note}>{day.note}</p>}

            {day.activities.length === 0 ? (
              <p>{t('emptyDay')}</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t('time')}</th>
                    <th>{t('activity')}</th>
                    <th>{t('estimatedCost')}</th>
                  </tr>
                </thead>

                <tbody>
                  {day.activities.map((activity) => (
                    <tr key={activity.id}>
                      <td>
                        {activity.startTime?.slice(0, 5) || '—'}
                        {activity.endTime
                          ? ` – ${activity.endTime.slice(0, 5)}`
                          : ''}
                      </td>

                      <td>
                        <strong>{activity.title}</strong>
                        {activity.location && <p>{activity.location}</p>}
                        {activity.note && (
                          <p className={styles.note}>{activity.note}</p>
                        )}
                      </td>

                      <td>
                        {formatCurrency(
                          activity.estimatedCost,
                          plan.baseCurrency,
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        ))}

        {plan.days.length === 0 && <p>{t('emptyPlan')}</p>}
      </article>

      <AppToast
        open={printError}
        message={t('printError')}
        severity="error"
        onClose={() => setPrintError(false)}
      />
    </div>
  );
};

export default PlanPrintView;
